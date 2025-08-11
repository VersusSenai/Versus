import matchModel from "../models/MatchModel.js"
import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";

const matchRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Partidas
 *   description: Endpoints relacionados a partidas (matchs)
 */

/**
 * @swagger
 * /event/{id}/match:
 *   get:
 *     summary: Retorna todas as partidas de um evento
 *     tags: [Partidas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Lista de partidas retornada com sucesso
 */
matchRoute.get("/:id/match",verifyToken ,async (req,res)=>{
    return await matchModel.getAll(req).then(r=>{
        res.status(200).json(r)
    })
});

/**
 * @swagger
 * /event/match/{id}:
 *   get:
 *     summary: Retorna uma partida pelo ID
 *     tags: [Partidas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da partida
 *     responses:
 *       200:
 *         description: Partida encontrada
 *       404:
 *         description: Partida não encontrada
 */
matchRoute.get("/:id",verifyToken ,async (req, res)=>{
    const data = await matchModel.getById(req)
    data != null? 
      res.status(200).json(data)
    :
      res.status(404).json({ message: "User not found" })
});

/**
 * @swagger
 * /event/match:
 *   post:
 *     summary: Cria uma nova partida
 *     tags: [Partidas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               teamA: "123"
 *               teamB: "456"
 *               eventId: "789"
 *     responses:
 *       201:
 *         description: Partida criada com sucesso
 *       400:
 *         description: Erro ao criar a partida
 */
matchRoute.post("/",verifyToken ,async(req, res)=>{
    await matchModel.create(req).then(data =>{
        res.status(201).json(data)
    }).catch(e =>{
        res.status(400).json(e)
    })
});

/**
 * @swagger
 * /event/match:
 *   put:
 *     summary: Atualiza uma partida
 *     tags: [Partidas]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               id: "match123"
 *               status: "completed"
 *     responses:
 *       200:
 *         description: Partida atualizada com sucesso
 *       400:
 *         description: Erro ao atualizar a partida
 *       403:
 *         description: Acesso negado
 */
matchRoute.put("/", verifyToken, async(req,res)=>{
    await matchModel.update(req).then(data=>{
        res.status(200).json(data)
    }).catch(e =>{
        res.status(400).json(e.message)
    })
});

/**
 * @swagger
 * /event/match:
 *   delete:
 *     summary: Deleta uma partida
 *     tags: [Partidas]
 *     responses:
 *       204:
 *         description: Partida deletada com sucesso
 *       400:
 *         description: Erro ao deletar a partida
 */
matchRoute.delete("/",verifyToken ,async(req,res)=>{
    await matchModel.delete(req).then(data=>{
        res.status(204).json(data)
    }).catch(e =>{
        res.status(400).json(e)
    })
});
/**
 * @swagger
 * /event/winner/{id}:
 *   post:
 *     summary: Declara o vencedor de uma partida (apenas dono do evento ou admin)
 *     tags: [Partidas]
 *     security:
 *       - organizerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da partida
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - winnerId
 *             properties:
 *               winnerId:
 *                 type: integer
 *                 description: ID do usuário ou time vencedor
 *                 example: 5
 *     responses:
 *       200:
 *         description: Vencedor declarado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "event has ended"
 *       400:
 *         description: Erro ao declarar o vencedor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User is not owner of this event"
 *       403:
 *         description: Acesso não autorizado
 *       404:
 *         description: Partida não encontrada
 *     description: |
 *       Este endpoint permite ao organizador do evento declarar o vencedor de uma partida.
 *       O sistema automaticamente:
 *       - Atualiza o status dos participantes (vencedor/perdedor)
 *       - Avança o vencedor para a próxima fase do torneio
 *       - Se for a final, marca o evento como concluído
 *       
 *       Fluxos possíveis:
 *       1. Se for a partida final:
 *          - Marca o vencedor como campeão (status W)
 *          - Marca o perdedor como vice (status L)
 *          - Retorna mensagem "event has ended"
 *       
 *       2. Se houver vaga na próxima chave:
 *          - Insere o vencedor na próxima partida
 *          - Retorna os detalhes da próxima partida
 *       
 *       3. Se não houver vaga na próxima chave:
 *          - Cria uma nova partida com o vencedor
 *          - Retorna os detalhes da nova partida
 */
matchRoute.post("/winner/:id", verifyToken ,async(req,res)=>{
    await matchModel.declareWinner(req).then(data=>{
        res.status(200).json(data)
    }).catch(e =>{
        res.status(400).json({ message: e.message })
    })
});

export default matchRoute;
