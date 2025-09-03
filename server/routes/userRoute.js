import userModel from "../models/UserModel.js";
import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/adminMiddleware.js";

const userRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Endpoints para gerenciamento de contas de usuário
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Lista todos os usuários (apenas Admin)
 *     tags: [Usuários]
 *     security:
 *       - adminAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Acesso não autorizado
 */
userRoute.get("/", isAdmin, async (req, res,next) => {
  await userModel.getAll(req)
    .then(data => res.status(200).json(data))
    .catch(e => next(e));
});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Obtém detalhes de um usuário específico
 *     tags: [Usuários]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Detalhes do usuário
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/User'
 *                 - $ref: '#/components/schemas/UserPublic'
 *         headers:
 *           X-Role-Required:
 *             description: Retorna menos campos se o solicitante não for admin
 *             schema:
 *               type: string
 *       404:
 *         description: Usuário não encontrado
 *       403:
 *         description: Acesso não autorizado
 */
userRoute.get("/:id", verifyToken, async (req, res, next) => {
  await userModel.getById(req)
    .then(data => res.status(200).json(data))
    .catch(e => next(e));
});

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Cria uma nova conta de usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "novousername"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "novo@email.com"
 *               password:
 *                 type: string
 *                 example: "novasenha123"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Erro na validação dos dados
 */
userRoute.post("/", async (req, res,next) => {
  await userModel.create(req)
    .then(data => res.status(201).json(data))
    .catch(e => next(e));
});

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Atualiza um usuário por ID (apenas Admin)
 *     tags: [Usuários]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "novousername"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "novo@email.com"
 *               password:
 *                 type: string
 *                 example: "novasenha123"
 *               role:
 *                 type: string
 *                 enum: [P, O, A]
 *                 example: "O"
 *               status:
 *                 type: string
 *                 enum: [A, D]
 *                 example: "A"
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPublic'
 *       400:
 *         description: Erro na atualização
 *       403:
 *         description: Acesso não autorizado
 */
userRoute.put("/:id", isAdmin, async (req, res,next) => {
  await userModel.updateById(req)
    .then(data => res.status(200).json(data))
    .catch(e => next(e));
});

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Atualiza os dados do próprio usuário
 *     tags: [Usuários]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "novousername"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "novo@email.com"
 *               password:
 *                 type: string
 *                 example: "novasenha123"
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPublic'
 *       400:
 *         description: Erro na atualização
 */
userRoute.put("/", verifyToken, async (req, res,next) => {
  await userModel.update(req)
    .then(data => res.status(200).json(data))
    .catch(e => next(e));
});

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Desativa a própria conta (marca como inativa)
 *     tags: [Usuários]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: Conta desativada com sucesso
 *       400:
 *         description: Erro ao desativar conta
 */
userRoute.delete("/", verifyToken, async (req, res,next) => {
  await userModel.delete(req)
    .then(data => res.status(204).json(data))
    .catch(e => next(e));
});

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Desativa um usuário por ID (apenas Admin)
 *     tags: [Usuários]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       204:
 *         description: Usuário desativado com sucesso
 *       400:
 *         description: Erro ao desativar usuário
 *       403:
 *         description: Acesso não autorizado
 */
userRoute.delete("/:id", isAdmin, async (req, res,next) => {
  await userModel.deleteById(req)
    .then(data => res.status(204).json(data))
    .catch(e => next(e));
});



userRoute.post("/forgetPassword", async (req, res,next) => {
  await userModel.passwordRecoverByEmail(req)
    .then(data => res.status(200).json({msg: "Email enviado com sucesso"}))
    .catch(e => next(e));
});

userRoute.patch("/recoverPassword", async (req, res,next) => {
  await userModel.passwordRecoverByToken(req)
    .then(data => res.status(200).json({msg: "Senha alterada com sucesso"}))
    .catch(e => next(e));
});

export default userRoute;