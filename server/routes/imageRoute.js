import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import ApplicationModel from "../models/ApplicationModel.js";
import isAdmin from "../middlewares/adminMiddleware.js";
import ImageService from "../services/ImageService.js";
const imageRoute = express.Router();


imageRoute.get("/:key", async (req, res)=>{
    const fileKey = req.params.key;


    try {
          const imageBuffer = await ImageService.get( fileKey);

        res.setHeader('Content-Type', 'image/png'); // ou 'image/png', 'image/gif', etc.
        res.setHeader('Content-Disposition', `attachment; filename="${fileKey}"`);
        
        res.status(200).send(imageBuffer);

    } catch (error) {
        console.log(error)
    }
})

export default imageRoute;