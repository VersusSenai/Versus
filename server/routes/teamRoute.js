import express from "express";
import teamModel from "../models/TeamModel.js";
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
teamRoute.get("/",verifyToken ,async (req, res) => {
  const teams = await teamModel.getAll(req);
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
teamRoute.get("/:id",verifyToken ,async (req, res,next) => {
  try {
    const team = await teamModel.getById(req);
    res.status(200).json(team);
  } catch (err) {
    next(err)
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
teamRoute.post("/", verifyToken, async (req, res, next) => {
  try {
    const team = await teamModel.create(req);
    res.status(201).json(team);
  } catch (err) {
    next(err)
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
teamRoute.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const updated = await teamModel.update(req);
    res.status(200).json(updated);
  } catch (err) {
    next(err)
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
teamRoute.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    await teamModel.delete(req);
    res.status(204).end();
  } catch (err) {
    next(err)
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
teamRoute.post("/:id/inscribe", verifyToken, async (req, res, next) => {
  try {
    const resp = await teamModel.inscribe(req);
    res.status(200).json(resp);
  } catch (err) {
    next(err)
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
teamRoute.post("/:id/unsubscribe", verifyToken, async (req, res, next) => {
  try {
    const resp = await teamModel.unsubscribe(req);
    res.status(200).json(resp);
  } catch (err) {
    next(err)
  }
});
/**
 * @swagger
 * /team/{id}/unsubscribe/{userId}:
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
 *       - name: userId
 *         in: path
 *         description: ID do usuário a ser removido
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
teamRoute.post("/:id/unsubscribe/:userId", verifyToken, async (req, res, next) => {
  try {
    const resp = await teamModel.unsubscribeById(req);
    res.status(200).json(resp);
  } catch (err) {
    next(err)
  }
});
/**
 * @swagger
 * /team/{id}/update/{userId}:
 *   post:
 *     summary: Atualiza inscrição do usuário no time
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
 *       - name: userId
 *         in: path
 *         description: ID do usuário a ser removido
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
teamRoute.put("/:id/update/:userId", verifyToken, async (req, res, next) => {
  try {
    const resp = await teamModel.updateUserInscription(req);
    res.status(200).json(resp);
  } catch (err) {
    next(err)
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
teamRoute.get("/:id/inscriptions",verifyToken ,async (req, res, next) => {
  const inscriptions = await teamModel.getAllInscriptions(req);
  res.json(inscriptions);
});


/**
 * @swagger
 * /team/:id/invite:
 *   get:
 *     summary: Convida Um jogador para o um time
 *     tags: [Times]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do time
  *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID do jogador
 *                 example: 3
 *     responses:
 *       200:
 *         description: Convite Enviado com sucesso
 *       400:
 *         description: Erro ao buscar inscrições
 */
teamRoute.post("/:id/invite", verifyToken, async (req, res, next) => {
  try {
    const result = await teamModel.invitePlayer(req);
    res.status(200).json(result);
  } catch (err) {
    next(err)
  }
});
/**
 * @swagger
 * /team/updateInvite:
 *   get:
 *     summary: Responde convite
 *     tags: [Time]
 *     security:
 *       - cookieAuth: []
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
teamRoute.post("/updateInvite", verifyToken, async (req, res, next) => {
  try {
    const result = await teamModel.updateInvite(req);
    res.status(200).json(result);
  } catch (err) {
    next(err)
  }
});
export default teamRoute;
