import teamService from "../services/team.js"
import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";

const teamRoute = express.Router();

teamRoute.get("/", async (req,res)=>{

    res.json(await teamService.getAll());
    console.log(teamService.getAll())

})

teamRoute.get("/:id", async (req, res)=>{
    const data = await teamService.getById(req)

    
    data != null? 
    res
    .json(data)
    .status(200)
    :
    res
    .status(404)
    .json({message: "Team not found"})
})

teamRoute.post("/", async(req, res)=>{
    const data = await teamService.create(req)

    data.id != null? 
    res
    .json(data)
    .status(201)
    :
    res
    .status(400)
    .json({message: "Team not created"})
})


teamRoute.put("/:id", verifyToken ,async(req,res)=>{
    if(req.params.id == null){
        res
        .status(401)
        .json({message: "Missing id"})
    }
    const data = await teamService.update(req);
    data.id != null? 
    res
    .json(data)
    .status(201)
    :
    res
    .status(400)
    .json({message: "Team not updated"})



})
teamRoute.delete("/:id", async(req,res)=>{
    await teamService.delete(req)
    res.json({message:"Team deleted"}).status(204)
})
export default teamRoute;