import 'dotenv/config'
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

class InviteModel{
    prisma;
    
    constructor() {
      this.prisma = new PrismaClient();
    }
    

    inviteToTournment = async({to, from, event})=>{
        const token = jwt.sign(
            {
                id: to.registeredUser,
                email: to.registeredUser.email,
                event: event.id
            }, 
                process.env.INVITE_SECRET,
            {
                expiresIn: '5 days'
            }
            )
        this.prisma.invite.create({
            data:{
                toUserId: to.id, fromUserId: from.id, description: "Convidando Usuário para o Evento: " . event.name, status: "P", token
            }
        })
        
        
    }
}