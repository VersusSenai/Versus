import verifyToken from "../middlewares/authMiddleware.js"
import express from "express"
import eventService from "../services/event.js"

const eventRoute = express.Router()

eventRoute.get("/",verifyToken ,async (req,res)=>{
    const data = await eventService.getAll();
    
    return res
    .status(200)
    .json(data)

})

eventRoute.get("/:id",verifyToken ,async(req,res)=>{
    const data = await eventService.getById(req);

    data != null? 
    res.status(200).json(data)
    :
    res.status(400).json({message: "Event not found"})

})

eventRoute.post("/",verifyToken ,async(req, res)=>{
    const data = await eventService.create(req)

    data.id != null? 
    res
    .json(data)
    .status(201)
    :
    res
    .status(400)
    .json({message: "event not created", data})
})


eventRoute.put("/:id", verifyToken ,async(req,res)=>{
    if(req.params.id == null){
        res
        .status(401)
        .json({message: "Missing id"})
    }
    const data = await eventService.update(req);
    data.id != null? 
    res
    .json(data)
    .status(201)
    :
    res
    .status(400)
    .json({message: "event not updated", data})



})
eventRoute.delete("/:id",verifyToken ,async(req,res)=>{
    await eventService.delete(req)
    res
    .status(204)
    .json({message:"event deleted"})
})
export default eventRoute;