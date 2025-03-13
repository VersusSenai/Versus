import express from "express";

const server = express();

server.listen(8080, ()=>{
    console.log("Server rodando na porta 8080")
})


server.get("/", (req,res)=>{
    res.send("oi")
})

