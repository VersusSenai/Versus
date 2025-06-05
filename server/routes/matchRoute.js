import matchService from "../services/matchs.js";
import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";

const matchRoute = express.Router();

matchRoute.get("/:id/match", async (req,res)=>{


    return await matchService.getAll(req).then(r=>{
        res
        .status(200)
        .json(r)
    })
})

matchRoute.get("/:id", async (req, res)=>{
    const data = await matchService.getById(req)

    
    data != null? 
    res
    .json(data)
    .status(200)
    :
    res
    .status(404)
    .json({message: "User not found"})
})

matchRoute.post("/", async(req, res)=>{
    await matchService.create(req).then(data =>{

        res
        .json(data)
        .status(201)
    }).catch(e =>{
        res
        .status(400)
        .json(e)

    })
})

matchRoute.put("/", verifyToken ,async(req,res)=>{
    await matchService.update(req).then(data=>{
        
        res
        .json(data)
        .status(200)
    }).catch(e =>{

        console.log(e)
        res
        .status(400)
        .json(e.message)

    })

})
matchRoute.delete("/", async(req,res)=>{

    await matchService.delete(req).then(data=>{
        
        res
        .json(data)
        .status(204)
    }).catch(e =>{

        console.log(e)
        res
        .status(400)
        .json(e)

    })
})

matchRoute.post("/:id/winner/:matchId", async(req,res)=>{

    await matchService.declareWinner(req).then(data=>{
        res
        .json(data)
        .status(204)
    }).catch(e =>{
        res
        .status(400)
        .json({message: e.message})

    })

}) 
export default matchRoute;