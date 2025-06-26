import express from "express";
import teamService from "../services/team.js";
import verifyToken from "../middlewares/authMiddleware.js";

const teamRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Times
 *   description: Gerenciamento de times
 */

/**
 * @swagger
 * /team:
 *   get:
 *     summary: Lista todos os times
 *     tags: [Times]
 *     responses:
 *       200:
 *         description: Lista de times
 */
teamRoute.get("/", async (req, res) => {
  const teams = await teamService.getAll();
  res.json(teams);
});

/**
 * @swagger
 * /team/{id}:
 *   get:
 *     summary: Retorna um time pelo ID
 *     tags: [Times]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do time
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Time encontrado
 *       404:
 *         description: Time não encontrado
 */
teamRoute.get("/:id", async (req, res) => {
  try {
    const team = await teamService.getById(req);
    res.status(200).json(team);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

/**
 * @swagger
 * /team:
 *   post:
 *     summary: Cria um novo time
 *     tags: [Times]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Time Alpha"
 *               description: "Time para competição local"
 *     responses:
 *       201:
 *         description: Time criado com sucesso
 *       400:
 *         description: Erro ao criar time
 */
teamRoute.post("/", verifyToken, async (req, res) => {
  try {
    const team = await teamService.create(req);
    res.status(201).json(team);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /team/{id}:
 *   put:
 *     summary: Atualiza um time pelo ID
 *     tags: [Times]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do time
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Time Alpha Atualizado"
 *               description: "Descrição atualizada"
 *     responses:
 *       200:
 *         description: Time atualizado
 *       400:
 *         description: Erro na atualização
 *       403:
 *         description: Sem permissão para editar
 */
teamRoute.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await teamService.update(req);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /team/{id}:
 *   delete:
 *     summary: Deleta um time pelo ID
 *     tags: [Times]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do time
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Time deletado com sucesso
 *       400:
 *         description: Erro ao deletar
 *       403:
 *         description: Sem permissão para deletar
 */
teamRoute.delete("/:id", verifyToken, async (req, res) => {
  try {
    await teamService.delete(req);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /team/{id}/inscribe:
 *   post:
 *     summary: Inscreve o usuário logado no time
 *     tags: [Times]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do time
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário inscrito no time
 *       400:
 *         description: Erro ao inscrever
 */
teamRoute.post("/:id/inscribe", verifyToken, async (req, res) => {
  try {
    const resp = await teamService.inscribe(req);
    res.status(200).json(resp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /team/{id}/unsubscribe:
 *   post:
 *     summary: Remove inscrição do usuário no time
 *     tags: [Times]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do time
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               userId: 5
 *     responses:
 *       200:
 *         description: Inscrição removida
 *       400:
 *         description: Erro ao remover inscrição
 *       403:
 *         description: Sem permissão para remover inscrição de outro usuário
 */
teamRoute.post("/:id/unsubscribe", verifyToken, async (req, res) => {
  try {
    const resp = await teamService.unsubscribe(req);
    res.status(200).json(resp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /team/{id}/inscriptions:
 *   get:
 *     summary: Lista todos os usuários inscritos no time
 *     tags: [Times]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do time
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de usuários inscritos
 */
teamRoute.get("/:id/inscriptions", async (req, res) => {
  const inscriptions = await teamService.getAllInscriptions(req);
  res.json(inscriptions);
});

export default teamRoute;
