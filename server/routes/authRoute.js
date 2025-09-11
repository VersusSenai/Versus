
import auth from "../services/auth.js";
import express from "express";
import dayjs from "dayjs";

const cookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    expires: dayjs().add(1, "day").toDate(),
  };

const frontEndUrl = process.env.FRONTEND_URL || "http://localhost:5173";
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
authRoute.post("/login", async (req, res, next) => {

  const resp = await auth.login(req).catch((err) => {
    next(err)
  });

  if (resp) {
    res
      .cookie("token", resp.token, cookieOptions)
      .cookie("refreshToken", resp.refreshToken, cookieOptions)
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



/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Gera um novo token de acesso e refresh token a partir do refresh token atual
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token refreshed
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
 *         description: Erro ao renovar o token
 */
authRoute.post("/refresh-token", async (req, res, next) => {

  const resp = await auth.refreshToken(req).catch((err) => {
    next(err);
  });
  if (resp) {
    res
      .cookie("token", resp.token, cookieOptions)
      .cookie("refreshToken", resp.refreshToken, cookieOptions)
      .json({
        message: "Token refreshed",
        user: {
          email: resp.email,
          username: resp.username,
          id: resp.id,
          role: resp.role,
        },
      });
  }



});

authRoute.get("/google", async(req, res, next)=>{

  const resp = await auth.generateAuthUrl(req).catch((err) => {
    next(err);
  });

  res.redirect(resp);
})

authRoute.get("/google/callback", async(req, res, next)=>{


  const resp = await auth.googleCallback(req).catch((err) => {
    next(err);
  });

  if (resp) {
    res
    .cookie("token", resp.token, cookieOptions)
    .cookie("refreshToken", resp.refreshToken, cookieOptions)
    .redirect(frontEndUrl+"/tournaments");
  }
});

authRoute.get("/discord", async(req, res, next)=>{

  const resp = await auth.discordAuthUrl(req).catch((err) => {
    next(err);

  });

  res.redirect(resp);

});

authRoute.get("/discord/callback", async(req, res, next)=>{
  const resp = await auth.discordCallback(req).catch((err) => {
    next(err);
  })

  if (resp) {
    res
    .cookie("token", resp.token, cookieOptions)
    .cookie("refreshToken", resp.refreshToken, cookieOptions)
    .redirect(frontEndUrl+"/tournaments");
  }
})
export default authRoute;
