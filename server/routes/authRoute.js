import auth from "../services/auth.js";
import express from "express";
import dayjs from "dayjs";

const authRoute = express.Router();

authRoute.post("/", async (req,res)=>{

    const cookieOptions = {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        expires: dayjs().add(1, "day").toDate(),
      };

    res
    .cookie("token", await auth.login(req), cookieOptions)
    .json({ message: "token gerado com sucesso"})
})

export default authRoute