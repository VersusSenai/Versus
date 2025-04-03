import userService from "../services/userServices.js"
import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";

const userRoute = express.Router();

userRoute.get("/", async (req,res)=>{

    res.json(await userService.getAll());
    console.log(userService.getAll())

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
    const data = await userService.create(req)

    data.id != null? 
    res
    .json(data)
    .status(201)
    :
    res
    .status(400)
    .json({message: "User not created"})
})


userRoute.put("/:id", verifyToken ,async(req,res)=>{
    if(req.params.id == null){
        res
        .status(401)
        .json({message: "Missing id"})
    }
    const data = await userService.update(req);
    data.id != null? 
    res
    .json(data)
    .status(201)
    :
    res
    .status(400)
    .json({message: "User not updated"})



})
userRoute.delete("/:id", async(req,res)=>{
    await userService.delete(req)
    res.json({message:"user deleted"}).status(204)
})
export default userRoute;