import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import notificationModel from "../models/notificationModel.js";

const notificationRoute = express.Router();


/**
 * @swagger
 * tags:
 *   name: Notificações
 *   description: Endpoints relacionados a notificações
 */



/** * @swagger
 * /notification:
 *  get:   
 *   summary: Retorna todas as notificações do usuário autenticado
 *   tags: [Notificações]
 *  responses:
 *    200:
 *      description: Lista de notificações retornada com sucesso
 *    401:
 *      description: Não autorizado
 *    500:
 *       description: Erro no servidor
 * 
 */

notificationRoute.get("/",verifyToken ,async (req,res, next)=>{
    return await notificationModel.getAllFromUser(req).then(r=>{
        res.status(200).json(r)
    }).catch(e=>{
        next(e)
    })
});


/** * @swagger
 * /notification/read:
 *  patch:
 *   summary: Marca notificações como lidas
 *  tags: [Notificações]
 *  responses:
 *   200:
 *    description: Notificações marcadas como lidas com sucesso
 *  401:
 *   description: Não autorizado
 *  500:
 *  description: Erro no servidor
 */
notificationRoute.patch("/read/:id",verifyToken ,async (req,res, next)=>{
    return await notificationModel.markAsRead(req).then(r=>{
        res.status(200).json(r)
    }).catch(e=>{
        next(e)
    })
});

export default notificationRoute;