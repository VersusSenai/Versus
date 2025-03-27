import connection from "../config/connection.js";
import bcrypt from "bcrypt"
import 'dotenv/config';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


const userServices = {

    getAll: async ()=>{
            return await prisma.user.findMany()
      },

    getById: async(req)=>{
       return await prisma.user.findFirst({where: { id: parseInt(req.params.id)}})

    },
    create: async (req)=>{
        const hash = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUNDS))

        return await prisma.user.create({data: {
            username: req.body.username,
            password: hash,
            email: req.body.email,
            role: req.body.role

        }})
    },

    update: async(req)=>{
        const hash = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUNDS))
        
        return await prisma.user.update({where: {id: parseInt(req.params.id)}, 
            data:{
                username: req.body.username,
                password: hash
            }
        })
    
    },

    delete: (req) =>{

        return prisma.user.delete({where: {id: parseInt(req.params.id)}});
        
    }
}

export default userServices;