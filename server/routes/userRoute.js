import userService from "../services/userServices.js"
import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";

const userRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Endpoints para gerenciamento de usuários
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retorna todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
userRoute.get("/", async (req, res) => {
  await userService.getAll(req)
    .then(data => res.status(200).json(data))
    .catch(e => res.status(400).json(e.message));});

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
userRoute.get("/:id", async (req, res) => {
  const data = await userService.getById(req);

  data != null
    ? res.status(200).json(data)
    : res.status(404).json({ message: "User not found" });
});

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               username: "joao"
 *               email: "joao@email.com"
 *               password: "123456"
 *     responses:
 *       201:
 *         description: Usuário criado
 *       400:
 *         description: Erro na criação
 */
userRoute.post("/", async (req, res) => {
  await userService.create(req)
    .then(data => res.status(201).json(data))
    .catch(e => res.status(400).json(e));
});

/**
 * @swagger
 * /user:
 *   put:
 *     summary: Atualiza dados do usuário autenticado
 *     tags: [Usuários]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               username: "joaoatualizado"
 *               email: "joao@novoemail.com"
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       400:
 *         description: Erro na atualização
 */
userRoute.put("/", verifyToken, async (req, res) => {
  await userService.update(req)
    .then(data => res.status(200).json(data))
    .catch(e => res.status(400).json(e.message));
});

/**
 * @swagger
 * /user:
 *   delete:
 *     summary: Deleta o usuário autenticado
 *     tags: [Usuários]
 *     responses:
 *       204:
 *         description: Usuário deletado
 *       400:
 *         description: Erro ao deletar
 */
userRoute.delete("/", async (req, res) => {
  await userService.delete(req)
    .then(data => res.status(204).json(data))
    .catch(e => res.status(400).json(e));
});

export default userRoute;
