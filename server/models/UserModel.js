import bcrypt from "bcryptjs";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import NotFoundException from "../exceptions/NotFoundException.js";
import ConflictException from "../exceptions/ConflictException.js";
import DataBaseException from "../exceptions/DataBaseException.js";
import { pagination } from "prisma-extension-pagination";
import MailSender from "../services/MailSender.js";
import dayjs from "dayjs"
import jwt from 'jsonwebtoken';

class UserModel {
  constructor() {
    this.prisma = new PrismaClient().$extends(pagination());
  }


  async getAll(req) {
    const userData = req.user;
    let page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

    return await this.prisma.user
      .paginate({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          registeredDate: true,
          status: true,
        },
      })
      .withPages({
        limit,
        page,
      });

    return await this.prisma.user.findMany();
  }

  async getById(req) {
    const userData = req.user;

    if (userData.role == "A") {
      const user = await this.prisma.user.findFirst({
        where: { id: parseInt(req.params.id), status: "A" },
      });
      if (user == null) {
        throw new NotFoundException("Usuário não encontrado");
      } else {
        return user;
      }
    }

    if (userData.role == "P" || userData.role == "O") {
      const user = await this.prisma.user.findFirst({
        where: { id: parseInt(req.params.id), status: "A" },
        select: {
          email: true,
          username: true,
          role: true,
        },
      });
      if (user == null) {
        throw new NotFoundException("Usuário não encontrado");
      } else {
        return user;
      }
    }
  }

  async create(req) {
    const hash = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.SALT_ROUNDS)
    );

    await this.prisma.user
      .create({
        data: {
          username: req.body.username,
          password: hash,
          email: req.body.email,
          role: "P",
          status: "A",
        },
      })
      .then((r) => {
        return r;
      })
      .catch((err) => {
        if (err.code == "P2002") {
          throw new ConflictException("Email or Username already in use");
        } else {
          throw new DataBaseException("Error while creating user");
        }
      });
  }

  async update(req) {
    const userData = req.user;

    const hash = req.body.password
      ? bcrypt.hashSync(
          req.body.password ? req.body.password : "mokup",
          parseInt(process.env.SALT_ROUNDS)
        )
      : userData.password;

    return await this.prisma.user
      .update({
        where: { id: parseInt(userData.id) },
        data: {
          email: req.body.email,
          username: req.body.username,
          password: hash,
        },
        select: {
          username: true,
          email: true,
          role: true,
          id: true,
        },
      })
      .catch((err) => {
        if (err.code == "P2002") {
          throw new ConflictException("Email or Username already in use");
        } else if (err.code === "P2025") {
          throw new NotFoundException("User not found");
        } else {
          throw new DataBaseException("Error while updating user");
        }
      });
  }

  async updateById(req) {
    const userData = req.user;

    const user = this.prisma.user.findFirst({ where: { id: req.params.id } });

    if (!user) {
      throw new NotFoundException("User not found");
    }
    const hash = req.body.password
      ? bcrypt.hashSync(
          req.body.password ? req.body.password : "mokup",
          parseInt(process.env.SALT_ROUNDS)
        )
      : user.password;

    return await this.prisma.user
      .update({
        where: { id: parseInt(req.params.id) },
        data: {
          email: req.body.email,
          username: req.body.username,
          password: hash,
          role: req.body.role,
          status: req.body.status,
        },
        select: {
          username: true,
          email: true,
          role: true,
          id: true,
        },
      })
      .catch((err) => {
        if (err.code == "P2002") {
          throw new ConflictException("Email or Username already in use");
        } else if (err.code === "P2025") {
          throw new NotFoundException("Match not found");
        } else {
          throw new DataBaseException("Error while updating user");
        }
      });
  }

  async delete(req) {
    const userData = req.user;

    await this.prisma.user
      .update({
        where: { id: userData.id },
        data: {
          status: "D",
        },
      })
      .catch((e) => {
        throw new DataBaseException("Error while deleting User");
      });
  }

  async deleteById(req) {
    await this.prisma.user
      .update({
        where: { id: parseInt(req.params.id) },
        data: {
          status: "D",
        },
      })
      .catch((e) => {
        throw new DataBaseException("Error while deleting User");
      });
  }

  async passwordRecoverByEmail(req) {
    const user = await this.prisma.user
      .findUnique({ where: { email: req.body.email } })
      .catch((e) => {
        throw new DataBaseException("Internal Server error");
      });

    if (user == null) {
      throw new NotFoundException("Usuário não encontrado");
    }

    const expirationDate = dayjs().add(5, "day");

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.PASSWORD_RECOVER_SECRET,
      {
        expiresIn: "5 days",
      }
    );

    const userPasswordRecover = await this.prisma.userPasswordRecover
      .create({
        data: {
          userId: user.id,
          token,
          expirationDate,
        },
      })
      .catch((e) => {
        throw new DataBaseException("Internal Server Error");
      });

    let mailSender = MailSender;

    await mailSender.sendMail({
      to: user.email,
      subject: "Token para recuperação de senha",
      text:
        "Aqui está seu token para recuperar sua senha: " + "http://localhost:5173/forgetPassword?token=" +
        userPasswordRecover.token,
      html: ""
    });

    return "";
  }

  async passwordRecoverByToken(req) {
    const userPasswordRecover = await this.prisma.userPasswordRecover.findUnique({ where: { token: req.query.token }, include: {user: true} }).catch((e) => {
      console.log(e)
      throw new DataBaseException("Internal Server Error");
    });
    if (!userPasswordRecover) {
      throw new NotFoundException("Token is invalid");
    }
    await jwt.verify(
      userPasswordRecover.token,
      process.env.PASSWORD_RECOVER_SECRET,
      async (err, authData) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            throw new NotFoundException("Token is invalid");
          } else {
            throw new DataBaseException("Internal Server Error");
          }
        }
      }
    );
    const hash = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.SALT_ROUNDS)
    );
    
    await this.prisma.user.update({where: {id: userPasswordRecover.userId}, data:{
      password: hash
    }}).catch(e=>{
      throw new DataBaseException("Internal Server Error");
      
    })
    
  }
}

export default new UserModel();
