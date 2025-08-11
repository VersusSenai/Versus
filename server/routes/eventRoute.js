import eventModel from "../models/EventModel.js";
import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import isOrganizer from "../middlewares/organizerMiddleware.js";
import isEventOwner from "../middlewares/eventOwnerMiddleware.js";

const eventRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Eventos
 *   description: Gerenciamento de eventos
 */

/**
 * @swagger
 * /event:
 *   get:
 *     summary: Lista todos os eventos
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: Lista de eventos
 */
eventRoute.get("/",verifyToken ,async (req, res) => {
  res.json(await eventModel.getAll(req));
});

/**
 * @swagger
 * /event/{id}:
 *   get:
 *     summary: Retorna um evento pelo ID
 *     tags: [Eventos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento encontrado
 *       404:
 *         description: Evento não encontrado
 */
eventRoute.get("/:id",verifyToken ,async (req, res) => {
  try {
    const event = await eventModel.getById(req);
    res.status(200).json(event);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Cria um novo evento
 *     tags: [Eventos]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Campeonato de Verão"
 *               startDate: "2025-07-01T10:00:00.000Z"
 *               maxPlayers: 8
 *               multiplayer: true
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       400:
 *         description: Erro ao criar evento
 */
eventRoute.post("/", isOrganizer ,verifyToken, async (req, res) => {
  try {
    const event = await eventModel.create(req);
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /event/{id}:
 *   put:
 *     summary: Atualiza um evento
 *     tags: [Eventos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
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
 *               name: "Campeonato Atualizado"
 *               startDate: "2025-07-05T12:00:00.000Z"
 *               maxPlayers: 16
 *     responses:
 *       200:
 *         description: Evento atualizado
 *       400:
 *         description: Erro na atualização
 */
eventRoute.put("/:id", isEventOwner, async (req, res) => {
  try {
    const updated = await eventModel.update(req);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /event/{id}:
 *   delete:
 *     summary: Remove um evento
 *     tags: [Eventos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Evento deletado
 *       400:
 *         description: Erro na deleção
 */
eventRoute.delete("/:id", verifyToken, async (req, res) => {
  try {
    await eventModel.delete(req);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /event/{id}/inscribe:
 *   post:
 *     summary: Inscreve o usuário logado no evento
 *     tags: [Eventos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               teamId: 3
 *     responses:
 *       200:
 *         description: Inscrição realizada
 *       400:
 *         description: Erro na inscrição
 */
eventRoute.delete("/:id/inscribe", verifyToken, async (req, res) => {
  try {
    const result = await eventModel.inscribe(req);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /event/{id}/unsubscribe/{userId}:
 *   post:
 *     summary: Remove a inscrição do usuário (ou de outro se for admin/organizador)
 *     tags: [Eventos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inscrição removida
 *       400:
 *         description: Erro ao remover inscrição
 */
eventRoute.delete("/:id/unsubscribe", verifyToken, async (req, res) => {
  try {
    const result = await eventModel.unsubscribe(req);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /event/{id}/unsubscribe/{userId}:
 *   post:
 *     summary: Remove a inscrição do usuário por Id (apenas admin ou dono do evento)
 *     tags: [Eventos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               userId: 7
 *     responses:
 *       200:
 *         description: Inscrição removida
 *       400:
 *         description: Erro ao remover inscrição
 */
eventRoute.post("/:id/unsubscribe/:userId", verifyToken, async (req, res) => {
  try {
    const result = await eventModel.unsubscribeByUserId(req);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /event/{id}/start:
 *   post:
 *     summary: Inicia o evento e gera os confrontos
 *     tags: [Eventos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Confrontos gerados
 *       400:
 *         description: Erro ao iniciar evento
 */
eventRoute.post("/:id/start", verifyToken, async (req, res) => {
  try {
    const result = await eventModel.startEvent(req);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
/**
 * @swagger
 * /event/{id}/inscriptions:
 *   get:
 *     summary: Lista todas as inscrições de um evento
 *     tags: [Eventos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Lista de inscrições do evento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Erro ao buscar inscrições
 */

eventRoute.get("/:id/inscriptions", verifyToken, async (req, res) => {
  try {
    const result = await eventModel.getAllInscriptions(req);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /event/inscriptions/me:
 *   get:
 *     summary: Lista as inscrições do usuário logado
 *     tags: [Eventos]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista de inscrições do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Erro ao buscar inscrições do usuário
 */

eventRoute.get("/inscriptions/me", verifyToken, async (req, res) => {
  try {
    const result = await eventModel.getMyInscriptions(req);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default eventRoute;
