import 'dotenv/config'
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import MailSender from "../services/MailSender.js"
import dayjs from "dayjs"
import DataBaseException from '../exceptions/DataBaseException.js';
import util from '../services/util.js';
import notificationService from '../services/notificationService.js';


class InviteModel{
    prisma;
    
    constructor() {
      this.prisma = new PrismaClient();
    }
    

    inviteToTournment = async(to, from, event, req)=>{
        let fullUrl =util.getFullUrl(req)
        const expirationDate = dayjs().add(5, 'day')
        
        const token = jwt.sign(
            {
                id: to.id,
                email: to.email,
                event: event.id
            }, 
                process.env.INVITE_SECRET,
            {
                expiresIn: "5 days"
            }
            )
        return await this.prisma.invite.create({
            data:{
                toUserId: to.id, 
                fromUserId: from.id, 
                description: "Convidando Usuário para o Torneio: " + event.name, 
                status: "P", 
                token, 
                expirationDate: expirationDate.toISOString(),
                callback: token,
                eventId: event.id
            }
        }).then(data=>{
            
            MailSender.sendMail({
                to: to.email,
                subject: "Versus - Convite para o Torneio: " + event.name,
                html: `<a href=" ${fullUrl}/event/updateInvite?token=${token} " >Convite:</a>`
            })
            notificationService.sendNotification({
                userId: to.id,
                title: "Convite para o Torneio: " + event.name,
                message: from.username + " convidou você para o torneio: " + event.name,
                link: `/event/updateInvite?token=${token}`
            })

            return {msg:"Invite Sent"}
        
        })
    }

    inviteToTeam = async(to, from, team, req)=>{
        let fullUrl =util.getFullUrl(req)

        const expirationDate = dayjs().add(5, 'day')
        
        const token = jwt.sign(
            {
                id: to.id,
                email: to.email,
                event: team.id
            }, 
                process.env.INVITE_SECRET,
            {
                expiresIn: "5 days"
            }
            )
        return await this.prisma.invite.create({
            data:{
                toUserId: to.id, 
                fromUserId: from.id, 
                description: "Convidando Usuário para o Time: " + team.name, 
                status: "P", 
                token, 
                expirationDate: expirationDate.toISOString(),
                callback: token,
                teamId: team.id
            }
        }).then(data=>{
            MailSender.sendMail({
                to: to.email,
                subject: "Versus - Convite para o Time: " + team.name,
                html: `<a href="${fullUrl}/team/updateInvite?token=${token}" >Convite </a>`
            })

            notificationService.sendNotification({
                userId: to.id,
                title: "Convite para o Time: " + team.name,
                message: from.username + " convidou você para o time: " + team.name,
                link: `/team/updateInvite?token=${token}`
            })

            return {msg:"Invite Sent"}
        })
    }

    inviteValidation = async(token)=>{
        const invite = await this.prisma.invite.findFirst({where: {token}, include:{
            toUser: true, fromUser: true, event: true, team: true
        }})
        if(invite.status != "P"){
            return false;
        }

        return await jwt.verify(invite.token, process.env.INVITE_SECRET, async (err, authData)=>{
            if(err){
                if (err.name === 'TokenExpiredError') {
                await this.prisma.invite.update({where:{token}, data:{
                    status: "E"
                }})

                return false
                }else{
                    throw new DataBaseException("Internal Server Error");
                    
                }

            }
            if(authData){
                return invite
            }
        })
    }


}

export default new InviteModel;