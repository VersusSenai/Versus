import bcrypt from "bcryptjs";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

class UserModel {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAll(req) {
    const userData = req.user;

    if (userData.role != "A") {
      throw new Error("Only administrators can call this operation");
    }

    return await this.prisma.user.findMany();
  }

  async getById(req) {
    const userData = req.user;

    if (userData.role == "A") {
      return await this.prisma.user.findFirst({
        where: { id: parseInt(req.params.id), status: "A" },
      });
    }
    
    if (userData.role == "P" || userData.role == "O") {
      return await this.prisma.user.findFirst({
        where: { id: parseInt(req.params.id), status: "A" },
        select: {
          email: true,
          username: true,
          role: true,
        },
      });
    }
  }

  async create(req) {
    const hash = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.SALT_ROUNDS)
    );

    return await this.prisma.user.create({
      data: {
        username: req.body.username,
        password: hash,
        email: req.body.email,
        role: "P",
        status: "A",
      },
    });
  }

  async update(req) {
    const userData = req.user;


    const hash = 
    req.body.password? 
    bcrypt.hashSync(
      req.body.password? req.body.password: "mokup",
      parseInt(process.env.SALT_ROUNDS)
    ):
    userData.password;

    return await this.prisma.user.update({
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
    });
  }

  async updateById(req) {
    const userData = req.user;

    const hash = 
    req.body.password? 
    bcrypt.hashSync(
      req.body.password? req.body.password: "mokup",
      parseInt(process.env.SALT_ROUNDS)
    ):
    userData.password;


    return await this.prisma.user.update({
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
    });
  }

  async delete(req) {
    const userData = req.user;

    await this.prisma.user.update({
      where: { id: userData.id },
      data: {
        status: "D",
      },
    });
  }

  async deleteById(req) {
    await this.prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status: "D",
      },
    });
  }
}

export default new UserModel();
