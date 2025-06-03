import teamService from "../services/team.js"
import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";

const teamRoute = express.Router();

teamRoute.get("/", async (req,res)=>{

    res.json(await teamService.getAll());
    console.log(teamService.getAll())

})

teamRoute.get("/:id", async (req, res)=>{
    await teamService.getById(req).then(data=>{
        res
        .json(data)
        .status(200)

    }).catch(e=>{
        res
        .status(404)
        .json({message: "Team not found"})

    })
})

teamRoute.post("/", async(req, res)=>{
    await teamService.create(req).then(data=>{
        res
        .json(data)
        .status(201)

    }).catch(e=>{
        
            res
            .status(400)
            .json(e.message)

    })
})


teamRoute.put("/:id", verifyToken ,async(req,res)=>{
    await teamService.update(req).then(data=>{
        res
        .json(data)
        .status(200)

    }).catch(e=>{
        
            res
            .status(400)
            .json(e.message)

    })


})
teamRoute.delete("/:id", async(req,res)=>{
    await teamService.delete(req).then(data=>{
        res
        .json(data)
        .status(200)

    }).catch(e=>{
        
            res
            .status(400)
            .json(e.message)

    })
})

teamRoute.get("/:id/inscription", async(req,res)=>{
    await teamService.getAllInscriptions(req).then(data=>{
        res.
        status(200)
        .json({data})
    })

})
teamRoute.post("/:id/inscription", async(req,res)=>{
    await teamService.inscribe(req).then(data=>{
           res.
        status(200)
        .json({data})
    }).catch(e=>{
        res
        .status(400)
        .json(e.message)
    })
})

teamRoute.delete("/:id/inscription", async(req,res)=>{
    await teamService.unsubscribe(req).then(data=>{
        res.
        status(204)
        .json({message: "Inscrição deletada"})
    }).catch(e=>{
        res
        .status(400)
        .json(e.message)
    })
})
export default teamRoute;