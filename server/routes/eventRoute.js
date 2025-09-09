import eventModel from "../models/EventModel.js";
import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import isOrganizer from "../middlewares/organizerMiddleware.js";

const eventRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Eventos
 *   description: Endpoints para gerenciamento de torneios/eventos
 */

/**
 * @swagger
 * /event:
 *   get:
 *     summary: Lista todos os eventos
 *     tags: [Eventos]
*     parameters:
 *       - in: query
 *         name: pagina
 *         required: false
 *         schema:
 *           type: integer
 *         description: numero da página
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: quantidade de dados
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: Array
 *         description: status
 
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
eventRoute.get("/", verifyToken, async (req, res, next) => {
  res.json(await eventModel.getAll(req));
});

/**
 * @swagger
 * /event/{id}:
 *   get:
 *     summary: Obtém detalhes de um evento específico
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Detalhes do evento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */
eventRoute.get("/:id", verifyToken, async (req, res, next) => {
  try {
    const event = await eventModel.getById(req);
    res.status(200).json(event);
  } catch (err) {
    next(err)
  }
});

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Cria um novo evento (apenas Organizadores/Admins)
 *     tags: [Eventos]
 *     security:
 *       - organizerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startDate
 *               - maxPlayers
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Torneio de Inverno"
 *               description:
 *                 type: string
 *                 example: "Torneio sazonal de inverno"
 *               maxPlayers:
 *                 type: integer
 *                 example: 8
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-01T10:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-02T18:00:00Z"
 *               model:
 *                 type: string
 *                 enum: [P, O]
 *                 example: "P"
 *               multiplayer:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Erro na validação dos dados
 *       403:
 *         description: Acesso não autorizado
 */
eventRoute.post("/", isOrganizer, async (req, res, next) => {
  try {
    const event = await eventModel.create(req);
    res.status(201).json(event);
  } catch (err) {
    next(err)
  }
});

/**
 * @swagger
 * /event/{id}:
 *   put:
 *     summary: Atualiza um evento (apenas dono ou admin)
 *     tags: [Eventos]
 *     security:
 *       - organizerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Evento atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Erro na atualização
 *       403:
 *         description: Acesso não autorizado
 */
eventRoute.put("/:id", isOrganizer, async (req, res, next) => {
  try {
    const updated = await eventModel.update(req);
    res.status(200).json(updated);
  } catch (err) {
    next(err)
  }
});

/**
 * @swagger
 * /event/{id}:
 *   delete:
 *     summary: Remove um evento (apenas dono ou admin)
 *     tags: [Eventos]
 *     security:
 *       - organizerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     responses:
 *       204:
 *         description: Evento removido com sucesso
 *       400:
 *         description: Erro ao remover evento
 *       403:
 *         description: Acesso não autorizado
 */
eventRoute.delete("/:id", isOrganizer, async (req, res, next) => {
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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID do time ou jogador (para eventos multiplayer ou não)
 *                 example: 3
 *     responses:
 *       200:
 *         description: Inscrição realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventInscription'
 *       400:
 *         description: Erro na inscrição
 *       403:
 *         description: Evento já iniciado ou usuário já inscrito
 */
eventRoute.post("/:id/inscribe", verifyToken, async (req, res, next) => {
  try {
    const result = await eventModel.inscribe(req);
    res.status(200).json(result);
  } catch (err) {
    next(err)
  }
});

/**
 * @swagger
 * /event/{id}/unsubscribe:
 *   delete:
 *     summary: Remove a própria inscrição do usuário no evento
 *     tags: [Eventos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Inscrição removida com sucesso
 *       400:
 *         description: Erro ao remover inscrição
 *       403:
 *         description: Evento já iniciado ou usuário não inscrito
 */
eventRoute.delete("/:id/unsubscribe", verifyToken, async (req, res, next) => {
  try {
    const result = await eventModel.unsubscribe(req);
    res.status(200).json(result);
  } catch (err) {
    next(err)
  }
});

/**
 * @swagger
 * /event/{id}/unsubscribe/{userId}:
 *   delete:
 *     summary: Remove a inscrição de um usuário (apenas dono do evento ou admin)
 *     tags: [Eventos]
 *     security:
 *       - organizerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser removido
 *     responses:
 *       200:
 *         description: Inscrição removida com sucesso
 *       400:
 *         description: Erro ao remover inscrição
 *       403:
 *         description: Acesso não autorizado ou evento já iniciado
 */
eventRoute.delete("/:id/unsubscribe/:userId", verifyToken, async (req, res, next) => {
  try {
    const result = await eventModel.unsubscribeByUserId(req);
    res.status(200).json(result);
  } catch (err) {
    next(err)
  }
});

/**
 * @swagger
 * /event/{id}/start:
 *   post:
 *     summary: Inicia o evento e gera os confrontos (apenas dono ou admin)
 *     tags: [Eventos]
 *     security:
 *       - organizerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Confrontos gerados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 *       400:
 *         description: Erro ao iniciar evento
 *       403:
 *         description: Acesso não autorizado
 */
eventRoute.post("/:id/start", isOrganizer, async (req, res, next) => {
  try {
    const result = await eventModel.startEvent(req);
    res.status(200).json(result);
  } catch (err) {
    // next(err)
        console.log(err)

  }
});

/**
 * @swagger
 * /event/{id}/inscriptions:
 *   get:
 *     summary: Lista todas as inscrições de um evento (apenas dono ou admin)
 *     tags: [Eventos]
 *     security:
 *       - organizerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Lista de inscrições
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventInscription'
 *       400:
 *         description: Erro ao buscar inscrições
 *       403:
 *         description: Acesso não autorizado
 */
eventRoute.get("/:id/inscriptions", isOrganizer, async (req, res, next) => {
  try {
    const result = await eventModel.getAllInscriptions(req);
    res.status(200).json(result);
  } catch (err) {
    next(err)
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
*     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Lista de inscrições do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventInscription'
 *       400:
 *         description: Erro ao buscar inscrições
 */
eventRoute.get("/inscriptions/me", verifyToken, async (req, res, next) => {
  try {
    const result = await eventModel.getMyInscriptions(req);
    res.status(200).json(result);
  } catch (err) {
    next(err)
  }
});

/**
 * @swagger
 * /event/:id/invite:
 *   get:
 *     summary: Convida Um jogador para o um torneio
 *     tags: [Eventos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento
  *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID do time ou jogador (para eventos multiplayer ou não)
 *                 example: 3
 *     responses:
 *       200:
 *         description: Convite Enviado com sucesso
 *       400:
 *         description: Erro ao buscar inscrições
 */
eventRoute.post("/:id/invite", verifyToken, async (req, res, next) => {
  try {
    const result = await eventModel.invitePlayer(req);
    res.status(200).json(result);
  } catch (err) {
    next(err)
  }
});
/**
 * @swagger
 * /event/updateInvite:
 *   get:
 *     summary: Responde convite
 *     tags: [Eventos]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
  *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accept:
 *                 type: boolean
 *                 description: resposta do jogador
 *                 example: true
 *     responses:
 *       200:
 *         description: Convite aceito com sucesso
 *       400:
 *         description: Erro com o convite
 */
eventRoute.post("/updateInvite", verifyToken, async (req, res, next) => {
  try {
    const result = await eventModel.updateInvite(req);
    res.status(200).json(result);
  } catch (err) {
    next(err)
  }
});

export default eventRoute;