import bcrypt from "bcrypt"
import 'dotenv/config';
import { PrismaClient } from '@prisma/client'
import serviceUtils from "./util.js";

const prisma = new PrismaClient()


const userServices = {

    getAll: async ()=>{
            return await prisma.user.findMany()
      },


    getById: async(req)=>{
    return await prisma.user.findFirst({where: { id: parseInt(req.params.id)},
        select:{
            email: true, username: true, id:true, role: true
        }})

    },
    
    create: async (req)=>{
        const hash = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUNDS))

        return await prisma.user.create({data: {
            username: req.body.username,
            password: hash,
            email: req.body.email,
            role: "P"

        }})
    },

    update: async(req)=>{
        const userData = await serviceUtils.getUserByToken(req);

        
        
        if(userData.role == "A" && (req.body.id == null || req.body.id == "")){
            if(req.body.password){
            const hash = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUNDS))
            return await prisma.user.update({where: {id: parseInt(userData.id)}, 
                data:{
                    email: req.body.email,
                    username: req.body.username,
                    password: hash
                },
                select: {
                    username: true, email: true, role: true, id: true
                }
            })
             }
            else{
            return await prisma.user.update({where: {id: parseInt(userData.id)}, 
                data:{
                    username: req.body.username,
                    email: req.body.email,

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
            return await prisma.user.update({where: {id: parseInt(userData.id)}, 
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
            return await prisma.user.update({where: {id: parseInt(userData.id)}, 
                data:{
                    username: req.body.username,
                },
                 select: {
                    username: true, email: true, role: true, id: true
                }
            })
            }
        }

        if(userData.role == "A"){
            return await prisma.user.update({where: {id: parseInt(req.body.id)}, 
            data:{
                email: req.body.email,
                username: req.body.username,
                role: req.body.role
            },
                 select: {
                    username: true, email: true, role: true, id: true
                }
        })
    }
    
    },

    delete: async (req) =>{
        const userData = await serviceUtils.getUserByToken(req);

        console.log(userData)
        if(userData.role == "A" && (req.body.userId == "" || req.body.userId== null)){
            
            console.log("eu cai aqui por algum motivo bizarro")
            throw new Error("UserId is missing")

        }

        if(userData.role == "A" && req.body.userId){
            await prisma.user.delete({where: {
                id: parseInt(req.body.userId)
            }})
        }
        if(userData.role == "O" || userData.role == "P"){
            await prisma.user.delete({where: {id: userData.id}})
        }
        
    }
}

export default userServices;