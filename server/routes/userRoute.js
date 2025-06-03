import userService from "../services/userServices.js"
import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";

const userRoute = express.Router();

userRoute.get("/", async (req,res)=>{

    res.json(await userService.getAll());

})

userRoute.get("/:id", async (req, res)=>{
    const data = await userService.getById(req)

    
    data != null? 
    res
    .json(data)
    .status(200)
    :
    res
    .status(404)
    .json({message: "User not found"})
})

userRoute.post("/", async(req, res)=>{
    await userService.create(req).then(data =>{

        res
        .json(data)
        .status(201)
    }).catch(e =>{
        res
        .status(400)
        .json(e)

    })
})

userRoute.put("/", verifyToken ,async(req,res)=>{
    await userService.update(req).then(data=>{
        
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
userRoute.delete("/", async(req,res)=>{

    await userService.delete(req).then(data=>{
        
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
export default userRoute;