import matchService from "../services/matchs.js";
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
matchRoute.get("/:id/match", async (req,res)=>{
    return await matchService.getAll(req).then(r=>{
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
matchRoute.get("/:id", async (req, res)=>{
    const data = await matchService.getById(req)
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
matchRoute.post("/", async(req, res)=>{
    await matchService.create(req).then(data =>{
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
    await matchService.update(req).then(data=>{
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
matchRoute.delete("/", async(req,res)=>{
    await matchService.delete(req).then(data=>{
        res.status(204).json(data)
    }).catch(e =>{
        res.status(400).json(e)
    })
});

/**
 * @swagger
 * /event/{id}/winner/{matchId}:
 *   post:
 *     summary: Declara o vencedor de uma partida
 *     tags: [Partidas]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *       - name: matchId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da partida
 *     responses:
 *       204:
 *         description: Vencedor declarado com sucesso
 *       400:
 *         description: Erro ao declarar o vencedor
 */
matchRoute.post("/:id/winner/:matchId", async(req,res)=>{
    await matchService.declareWinner(req).then(data=>{
        res.status(200).json(data)
    }).catch(e =>{
        res.status(400).json({ message: e.message })
    })
});

export default matchRoute;
