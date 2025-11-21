import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import ApplicationModel from "../models/ApplicationModel.js";
import isAdmin from "../middlewares/adminMiddleware.js";
import ImageService from "../services/ImageService.js";
const imageRoute = express.Router();

/**
 * @swagger
 * tags:
 *   name: Imagens
 *   description: Endpoints para servir imagens armazenadas
 */

/**
 * @swagger
 * /image/{key}:
 *   get:
 *     summary: Recupera a imagem pelo key
 *     tags: [Imagens]
 *     parameters:
 *       - name: key
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador da imagem
 *     responses:
 *       200:
 *         description: Imagem retornada com sucesso (binary)
 *       404:
 *         description: Imagem não encontrada
 */
imageRoute.get("/:key", async (req, res)=>{
    const fileKey = req.params.key;


    try {
        const imageBuffer = await ImageService.get( fileKey);

        res.setHeader('Content-Type', 'image/jpeg'); 
        res.setHeader('Content-Disposition', `attachment; filename="${fileKey}.png"`);
        
        res.status(200).send(imageBuffer);

    } catch (error) {
        res.status(404).json({message: "Image not found"});
    }
})

export default imageRoute;