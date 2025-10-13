import express from "express";
import teamModel from "../models/TeamModel.js";
import verifyToken from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/adminMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
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
 *         description: Lista de times
 */
teamRoute.get("/",verifyToken ,async (req, res, next) => {
  const teams = await teamModel.getAll(req).then(r=>{
      if(r){
        res.json(r);
      }

    }).catch(e=>{
          next(e)
    });
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
teamRoute.post("/", verifyToken, upload.single('image'), async (req, res, next) => {
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
teamRoute.put("/:id", verifyToken, upload.single('image'), async (req, res, next) => {
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
 *   post:
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
 *   patch:
 *     summary: Responde convite de time (aceitar/recusar)
 *     tags: [Times]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inviteId:
 *                 type: integer
 *                 description: ID do convite
 *                 example: 123
 *               accept:
 *                 type: boolean
 *                 description: Resposta do usuário (true = aceitar, false = recusar)
 *                 example: true
 *     responses:
 *       200:
 *         description: Convite atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Não autorizado
 */
teamRoute.patch("/updateInvite", verifyToken, async (req, res, next) => {
  try {
    const result = await teamModel.updateInvite(req);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /team/approveTeam/{id}:
 *   post:
 *     summary: Aprovar time pendente
 *     tags: [Times]
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do time
 *     responses:
 *       200:
 *         description: Convite aceito com sucesso
 *       400:
 *         description: Erro com o convite
 */
teamRoute.post("/approveTeam/:id", isAdmin, async (req, res, next) => {
  try {
    const result = await teamModel.approveTeam(req);
    res.status(200).json(result);
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
 * /team/getByUserId/{id}:
 *   post:
 *     summary: Busca o time por id de usuário
 *     tags: [Times]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do usuário
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 
 *       400:
 *         description: Erro ao Buscar
 */
teamRoute.get("/getByUserId/:id", verifyToken, async (req, res, next) => {
  try {
    const resp = await teamModel.getByUserId(req);
    res.status(200).json(resp);
  } catch (err) {
    console.log(err)
    next(err)
  }
});
export default teamRoute;
