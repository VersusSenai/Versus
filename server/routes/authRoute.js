import auth from "../services/auth.js";
import express from "express";
import dayjs from "dayjs";

const authRoute = express.Router();

authRoute.post("/login", async (req,res)=>{

    const cookieOptions = {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        expires: dayjs().add(1, "day").toDate(),
      };


    const resp = await auth.login(req).catch(err =>{
        res
        .status(400)
        .json(err.message)
    })

    if(resp){
      res
      .cookie("token", resp.token, cookieOptions)
      .json({ message: "token gerado com sucesso", user:{ email: resp.email, username: resp.username}})

    }
})

authRoute.post("/logout", async (req,res)=>{

  res.cookie("token", null)
  .json({ message: "logout with success"})
})



export default authRoute