import verifyToken from "../middlewares/authMiddleware.js"
import express from "express"
import eventService from "../services/event.js"

const eventRoute = express.Router()

eventRoute.get("/",verifyToken ,async (req,res)=>{

    const data = await eventService.getAll(req);
    
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

    await eventService.create(req).then(data=>{
        
        res
        .json(data)
        .status(201)
    }).catch(e=>{
            res
            .status(400)
            .json({message: e.message})

    })

})


eventRoute.put("/:id", verifyToken ,async(req,res)=>{
    if(req.params.id == null){
        res
        .status(401)
        .json({message: "Missing id"})
    }
    const data = await eventService.update(req).then(data=>{

        res
        .json(data)
        .status(200)
    }).catch(e=>{
        res
        .status(400)
        .json(e.message)

    })



})
eventRoute.delete("/:id",verifyToken ,async(req,res)=>{
    await eventService.delete(req).then(data =>{
        res
        .status(204)
        .json({message:"event deleted"})

    }).catch(e=>{
        res
        .status(400)
        .json(e.message)
    })
})

eventRoute.post("/:id/inscription",verifyToken ,async(req,res)=>{
    


    await eventService.inscribe(req).then(data=>{
        res
        .status(200)
        .json(data)
    }).catch(e=>{
        res
        .status(400)
        .json(e.message)
    })
})


eventRoute.delete("/:id/inscription",verifyToken ,async(req,res)=>{
    
    await eventService.unsubscribe(req).then((data)=>{
        res
        .status(204)
        .json({message: "User unsubscribed"})
    }).catch(e=>{
        res
        .status(400)
        .json(e.message)
    })
})

eventRoute.get("/:id/inscription", async(req, res)=>{

    const data = await eventService.getAllInscriptions(req)

    return res
    .status(200)
    .json(data)
})

eventRoute.post("/:id/startEvent", async(req,res)=>{

    console.log(req.params.id)
    await eventService.startEvent(req).then(data=>{
    return res
    .status(200)
    .json(data)
    }).catch(e=>{
        res
        .status(400)
        .json(e.message)
    })
})

export default eventRoute;
