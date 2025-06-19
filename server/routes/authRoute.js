import auth from "../services/auth.js";
import express from "express";
import dayjs from "dayjs";

const authRoute = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login e retorna um token de autenticação via cookie
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: token gerado com sucesso
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Erro de autenticação
 */
authRoute.post("/login", async (req, res) => {
  const cookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    expires: dayjs().add(1, "day").toDate(),
  };

  const resp = await auth.login(req).catch((err) => {
    res.status(400).json(err.message);
  });

  if (resp) {
    res
      .cookie("token", resp.token, cookieOptions)
      .json({
        message: "Token generated",
        user: {
          email: resp.email,
          username: resp.username,
          id: resp.id,
          role: resp.role,
        },
      });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Realiza logout do usuário removendo o cookie
 *     tags:
 *       - Autenticação
 *     responses:
 *       200:
 *         description: Logout com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: logout with success
 */
authRoute.post("/logout", async (req, res) => {
  res.cookie("token", null).json({ message: "logout with success" });
});

export default authRoute;
