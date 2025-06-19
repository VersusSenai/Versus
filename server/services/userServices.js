import bcrypt from "bcrypt"
import 'dotenv/config';
import { PrismaClient } from '@prisma/client'
import serviceUtils from "./util.js";

const prisma = new PrismaClient()


const userServices = {

    getAll: async (req)=>{
        const userData = await serviceUtils.getUserByToken(req);

        if(userData.role != "A"){
            throw new Error("Only administrators can call this operation");
            
        }
        
        return await prisma.user.findMany()
      },


    getById: async(req)=>{
    const userData = await serviceUtils.getUserByToken(req);

    if(userData.role == "A"){
        return await prisma.user.findFirst({where: { id: parseInt(req.params.id), status: "A"}})
    }
    if(userData.role == "P" || userData.role == "O"){

        return await prisma.user.findFirst({where: { id: parseInt(req.params.id),  status: "A"},
            select:{
                email: true, username: true, role: true
            }})
    }
    


    },
    
    create: async (req)=>{
        const hash = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUNDS))

        return await prisma.user.create({data: {
            username: req.body.username,
            password: hash,
            email: req.body.email,
            role: "P",
            status: "A"

        }})
    },

    update: async(req)=>{
        const userData = await serviceUtils.getUserByToken(req);
        
        if(userData.role == "A"){
            if(req.body.password){
            const hash = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUNDS))
            return await prisma.user.update({where: {id: parseInt(req.body.id)}, 
                data:{
                    email: req.body.email,
                    username: req.body.username,
                    password: hash,
                    role: req.body.role,
                    status: req.body.status
                },
                select: {
                    username: true, email: true, role: true, id: true
                }
            })
             }
            else{
            return await prisma.user.update({where: {id: parseInt(req.body.id)}, 
                data:{
                    username: req.body.username,
                    email: req.body.email,
                    role: req.body.role,
                    status: req.body.status
                },
                 select: {
                    username: true, email: true, role: true, id: true
                }
            })
            }
        }
        if(userData.role == "P" || userData.role == "O"){
            if(req.body.password){
            const hash = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUNDS))
            return await prisma.user.update({where: {id: parseInt(userData.id), status: "A"}, 
                data:{
                    username: req.body.username,
                    password: hash
                },
                 select: {
                    username: true, email: true, role: true, id: true
                }
            })
             }
            else{
            return await prisma.user.update({where: {id: parseInt(userData.id), status: "A"}, 
                data:{
                    username: req.body.username,
                },
                 select: {
                    username: true, email: true, role: true, id: true
                }
            })
            }
        }
    
    },

    delete: async (req) =>{
        const userData = await serviceUtils.getUserByToken(req);

        if(userData.role == "A" && (req.body.userId == "" || req.body.userId== null)){
            
            throw new Error("UserId is missing")

        }

        if(userData.role == "A" && req.body.userId){
            await prisma.user.update({where: {
                id: parseInt(req.body.userId)}, data:{
                    status: "D"
                }})
        }
        if(userData.role == "O" || userData.role == "P"){
            await prisma.user.update({where: {id: userData.id}, data:{
                    status: "D"
                }});
        }
        
    }
}

export default userServices;