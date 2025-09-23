import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import ApplicationModel from "../models/ApplicationModel.js";
import isAdmin from "../middlewares/adminMiddleware.js";

const applicationRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Aplicações
 *   description: Endpoints relacionados a pedidos de usuários
 */

/**
 * @swagger
 * /application:
 *   get:
 *     summary: Lista todas as aplicações
 *     tags: [Aplicações]
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
 *         description: Lista de Aplcações
 */
applicationRoute.get("/", isAdmin, async (req, res, next) => {
  await ApplicationModel.getAll(req).then(r=>{
    res.json(r)
  }).catch(e=>{
    next(e)
  });
});
/**
 * @swagger
 * /application:
 *   post:
 *     summary: Cria uma aplicacao
 *     tags: [Aplicações]
 *     security:
 *       - cookieAuth: []
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
 *               description:
 *                 type: string
 *                 example: "Aplicação para me tornar Organizador de Evento"
 *     responses:
 *       201:
 *         description: Aplicacao criado com sucesso
 *         content:
 *       400:
 *         description: Erro na validação dos dados
 *       403:
 *         description: Acesso não autorizado
 */
applicationRoute.post("/", verifyToken, async (req, res, next) => {
 await ApplicationModel.create(req).then(r=>{
    res.json(r)
  }).catch(e=>{
    next(e)
  });
});

/**
 * @swagger
 * /application/{id}:
 *   put:
 *     summary: Aprova uma aplicacao
 *     tags: [Aplicações]
 *     security:
 *       - adminAuth: []
 *     responses:
 *       201:
 *         description: Aplicacao aprovada com sucesso
 *       400:
 *         description: Erro na validação dos dados
 *       403:
 *         description: Acesso não autorizado
 */
applicationRoute.put("/:id", isAdmin, async (req, res, next) => {
 await ApplicationModel.acceptApplication(req).then(r=>{
    res.json(r)
  }).catch(e=>{
    next(e)
  });

});

export default applicationRoute;
