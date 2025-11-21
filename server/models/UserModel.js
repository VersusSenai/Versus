import bcrypt from "bcryptjs";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import NotFoundException from "../exceptions/NotFoundException.js";
import ConflictException from "../exceptions/ConflictException.js";
import DataBaseException from "../exceptions/DataBaseException.js";
import { pagination } from "prisma-extension-pagination";
import MailSender from "../services/MailSender.js";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import MatchModel from "./MatchModel.js";
import ImageService from "../services/ImageService.js";
import fs from "fs";
import path from "path";
const frontEndUrl = process.env.FRONTEND_URL || "http://localhost:5173";
import prisma from "../ config/prismaClient.js";
class UserModel {
  async getAll(req) {
    const userData = req.user;
    let page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    let limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    const searchTerm = req.query.search;

    // Se houver termo de busca, buscar por email ou username
    const whereClause = searchTerm
      ? {
          status: "A",
          OR: [
            {
              email: {
                contains: searchTerm,
              },
            },
            {
              username: {
                contains: searchTerm,
              },
            },
          ],
        }
      : {
          status: "A",
        };

    return await prisma.user
      .paginate({
        where: whereClause,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          registeredDate: true,
          status: true,
          icon: true,
        },
      })
      .withPages({
        limit,
        page,
      });
  }

  async getById(req) {
    const userData = req.user;

    if (userData.role == "A") {
      const user = await prisma.user.findFirst({
        where: { id: parseInt(req.params.id), status: "A" },
      });
      if (user == null) {
        throw new NotFoundException("Usuário não encontrado");
      } else {
        return user;
      }
    }

    if (userData.role == "P" || userData.role == "O") {
      const user = await prisma.user.findFirst({
        where: { id: parseInt(req.params.id), status: "A" },
        select: {
          email: true,
          username: true,
          role: true,
          icon: true,
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
      parseInt(process.env.SALT_ROUNDS),
    );

    await prisma.user
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
        console.log(err);
        if (err.code == "P2002") {
          throw new ConflictException("Email or Username already in use");
        } else {
          throw new DataBaseException("Error while creating user");
        }
      });
  }

  async update(req) {
    const userData = req.user;

    const file = req.file;
    let image = {};
    if (typeof req.body.image == "string") {
      image["url"] = null;
    }

    if (
      (userData.icon && file) ||
      (userData.icon && typeof req.body.image == "string")
    ) {
      let url = req.user.icon.replace(/\/+$/, "");
      const partes = url.split("/");
      let toDelete = partes[partes.length - 1];
      await ImageService.delete(toDelete);
    }
    if (file) {
      try {
        image = await ImageService.upload(file);
      } catch (error) {
        throw new DataBaseException("Intenal Server error");
      }
    }
    const hash = req.body.password
      ? bcrypt.hashSync(
          req.body.password ? req.body.password : "mokup",
          parseInt(process.env.SALT_ROUNDS),
        )
      : userData.password;

    return await prisma.user
      .update({
        where: { id: parseInt(userData.id) },
        data: {
          email: req.body.email,
          username: req.body.username,
          password: hash,
          icon: image ? image.url : undefined,
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

    const user = prisma.user.findFirst({ where: { id: req.params.id } });

    if (!user) {
      throw new NotFoundException("User not found");
    }
    const hash = req.body.password
      ? bcrypt.hashSync(
          req.body.password ? req.body.password : "mokup",
          parseInt(process.env.SALT_ROUNDS),
        )
      : user.password;

    return await prisma.user
      .update({
        where: { id: parseInt(req.params.id) },
        data: {
          email: req.body.email,
          username: req.body.username,
          password: hash,
          role: req.body.role,
          status: req.body.status,
          icon: req.body.image,
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

    await prisma.user
      .update({
        where: { id: userData.id },
        data: {
          status: "D",
        },
      })
      .then(async (data) => {
        console.log(data);
        await MatchModel.declareWinnerBatch({ userId: data.id });
      })
      .catch((e) => {
        throw new DataBaseException("Error while deleting User");
      });
  }

  async deleteById(req) {
    await prisma.user
      .update({
        where: { id: parseInt(req.params.id) },
        data: {
          status: "D",
        },
      })
      .then(async (data) => {
        await MatchModel.declareWinnerBatch({ userId: data.id });
      })
      .catch((e) => {
        console.log(e);
        throw new DataBaseException("Error while deleting User");
      });
  }

  async passwordRecoverByEmail(req) {
    const user = await prisma.user
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
      },
    );

    const userPasswordRecover = await prisma.userPasswordRecover
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

    const templatePath = path.join(
      process.cwd(),
      "templates",
      "email",
      "forgetpassword.html",
    );
    let htmlTemplate;

    try {
      htmlTemplate = fs.readFileSync(templatePath, "utf8");
    } catch (error) {
      console.error("Erro ao ler template HTML:", error);
      htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Recupere sua senha da Versus</h2>
          <p>Clique no link abaixo para redefinir sua senha:</p>
          <a href="{{reset_link}}" style="background: #8a2be2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
        </div>
      `;
    }

    const resetLink = `${frontEndUrl}/forgetPassword?token=${userPasswordRecover.token}`;
    const htmlContent = htmlTemplate.replace("{{reset_link}}", resetLink);

    let mailSender = MailSender;

    await mailSender.sendMail({
      to: user.email,
      subject: "Recupere sua senha da Versus ⚡",
      text: `Recupere sua senha da Versus. Acesse: ${resetLink}`,
      html: htmlContent,
    });

    return "";
  }

  async passwordRecoverByToken(req) {
    const userPasswordRecover = await prisma.userPasswordRecover
      .findUnique({
        where: { token: req.query.token },
        include: { user: true },
      })
      .catch((e) => {
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
      },
    );
    const hash = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.SALT_ROUNDS),
    );

    await prisma.user
      .update({
        where: { id: userPasswordRecover.userId },
        data: {
          password: hash,
        },
      })
      .catch((e) => {
        throw new DataBaseException("Internal Server Error");
      });
  }
}

export default new UserModel();
