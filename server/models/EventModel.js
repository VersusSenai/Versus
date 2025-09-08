
import serviceUtils from '../services/util.js';
import NotFoundException from '../exceptions/NotFoundException.js';
import BadRequestException from '../exceptions/BadRequestException.js';
import DataBaseException from '../exceptions/DataBaseException.js';
import NotAllowedException from '../exceptions/NotAllowedException.js';
import ConflictException from '../exceptions/ConflictException.js';
import inviteModel from './inviteModel.js';

import {pagination} from "prisma-extension-pagination";
import { PrismaClient } from '@prisma/client';


class EventModel {
  

  constructor() {
    this.prisma = new PrismaClient().$extends(pagination());
  }

  getAll = async (req) => {
    let page = req.query.page? parseInt(req.query.page): 1;
    let limit =  req.query.limit? parseInt(req.query.limit): 10;
    let status = req.query.status? req.query.status : ["P", "O"];
    if(!Array.isArray(status)){
      status = [status]
    }
    
    return await this.prisma.event.paginate({where: {
      status: {
        in: status,
      },
      private: false
    }}).withPages({
      page, limit
    })

    
  };
  

  getById = async (req) => {
    return await this.prisma.event.findUnique({
      where: { id: parseInt(req.params.id) },
    }).then(r=>{
      if(r == null){
        throw new NotFoundException("Event not found");

      }else{
        return r
      }
    });

  };

  create = async (req) => {
    const userData =req.user;
    const now = new Date();

    if(now > Date.parse(req.body.startDate)){
      throw new BadRequestException("Event start date cannot be before today");
    }
    if(Date.parse(req.body.startDate) > Date.parse(req.body.endDate)){
      throw new BadRequestException("Event start date cannot be after endDate");
    }
    if(parseInt(req.body.maxPlayers) %2 !=0){
      throw new BadRequestException("Player quantity must be even")
    }

    
    const newEvent = await this.prisma.event.create({
      data: {   ...req.body, status: "P",maxPlayers: parseInt(req.body.maxPlayers) ,eventInscriptions: {
        create:[
          {userId: userData.id, status: "C", role: "O", status: 'O'}
        ]
      }},
    });
    
    return newEvent;


  };

  update = async (req) => {
    const isUserOwner = await this.isUserOwner(req.user, parseInt(req.params.id))
    if(!isUserOwner){
      throw new NotAllowedException("Only the owner of this event can update it");
    }

    return await this.prisma.event.update({where: {id: parseInt(req.params.id)},
      data:{
        ...req.body
      }
    }).catch(e=>{

      if (err.code === 'P2025') {
        throw new NotFoundException("Event not found");
      }
      throw new DataBaseException("Event cannot be Updated");
      
    })

  };

  inscribe = async (req) => {

    const userData = req.user;
    const eventId = parseInt(req.params.id);

    const event = await this.prisma.event.findFirst({ where: { id: eventId } });

    if (!event) throw new BadRequestException("Event not found");
    if(event.keysQuantity != null){
      throw new ConflictException("Event already started");
    }
    if(event.private){
      throw new NotAllowedException("You need to get invited to inscribe in a Private Tournment");
      
    }

    if (event.multiplayer == true){
      const teamId = req.body.id ? parseInt(req.body.id) : null;

        if (teamId != null && !isNaN(teamId)) {
          const team = await this.prisma.team.findFirst({ where: { id: teamId } });

          if (!team) {
            throw new BadRequestException("Team does not exist");
          }

          const isTeamAlreadyInscribed = await this.prisma.eventInscriptions.findFirst({
            where: {
              teamId: teamId,
              eventId: eventId,
            },
          });

          if (isTeamAlreadyInscribed) {
            throw new ConflictException("Team already inscribed");
          }
          const userTeamInscription = await this.prisma.teamUsers.findFirst({where:{
            teamId: team.id, userId: userData.id
          }})



          if (userTeamInscription.role == "O") {
            return this.prisma.eventInscriptions.create({
              data: {
                teamId: team.id,
                eventId: eventId,
                role: "P",
                status: "O"
              },
            });
          } else {
            throw new ConflictException("You are not the owner of this team");
          }
        }
    }else{

      const isUserAlreadyInscribed = await this.prisma.eventInscriptions.findFirst({
        where: {
          userId: userData.id,
          eventId: eventId,
        },
      });

      if (isUserAlreadyInscribed) {
        throw new ConflictException("User already inscribed");
      }

    

      // Caso seja inscrição individual
      return this.prisma.eventInscriptions.create({
        data: {
          userId: userData.id,
          eventId: eventId,
          role: "P",
          status: "O"
        },
      });

    }

  };

  delete = async (req) => {

    const isUserOwner = await this.isUserOwner(req.user, parseInt(req.params.id));

    if(!isUserOwner){
      throw new NotAllowedException("User is not owner of this event");
    }

    return await this.prisma.event.delete({where: {id: parseInt(req.params.id)}}).catch(e=>{
      throw new DataBaseException("Error while trying to delete tournment");
      
    });

  }

  unsubscribe = async (req) => {
    const userData = req.user;
    const eventId = parseInt(req.params.id);

    const event = await this.prisma.event.findFirst({ where: { id: eventId } });

    if (!event) throw new Error("Event not found");
    if(event.keysQuantity != null){
      throw new ConflictException("Event already started");
    }

    const userInscription = await this.prisma.eventInscriptions.findFirst({where: {userId: userData.id, eventId}})
    if(!userInscription){
      throw new ConflictException("User not inscribed");

    }

    if(userInscription != null && userInscription.role == "P"){
      await this.prisma.eventInscriptions.update({where: {id: userInscription.id}, data:{role: "R"}})
    }else{
      throw new ConflictException("Owner cannot unsubscribe himself");
      
    }

  };

  unsubscribeByUserId = async (req) => {
    const eventId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);
    const teamId = parseInt(req.params.teamId);

    const event = await this.prisma.event.findFirst({ where: { id: eventId } });

    if (!event) throw new Error("Event not found");
    if(event.keysQuantity != null){
      throw new ConflictException("Event already started");
    }

    const isUserOwner = await this.isUserOwner(req.user, eventId);

    if(!isUserOwner){
      throw new ConflictException("User is not Owner of this event");
      
    }

    if(!isNaN(teamId) && teamId!= null){
      const teamInscription = await this.prisma.eventInscriptions.findFirst({where: {userId: userId, eventId}})
  
      if(!teamInscription){
      throw new ConflictException("Team not inscribed");

      }
      if(teamInscription != null && teamInscription.role == "P"){
        await this.prisma.eventInscriptions.delete({where: {id: teamInscription.id}, data:{role: "R"}})
      }else{
        throw new ConflictException("Owner cannot unsubscribe himself");
        
      }

    }
    const userInscription = await this.prisma.eventInscriptions.findFirst({where: {userId: userId, eventId}})
    
    if(!userInscription){
      throw new ConflictException("User not inscribed");

    }
    if(userInscription != null && userInscription.role == "P"){
      await this.prisma.eventInscriptions.delete({where: {id: userInscription.id}, data:{role: "R"} })
    }else{
      throw new ConflictException("Owner cannot unsubscribe himself");
      
    }

  };

  getAllInscriptions = async(req)=>{
    const userData = await serviceUtils.getUserByToken(req);
    const isOwner = await this.isUserOwner(req.user, parseInt(req.params.id));

    if(!isOwner){
      throw new NotAllowedException("Only the owner of this event can make this call");
    }

    return await this.prisma.eventInscriptions.findMany({where: {eventId: parseInt(req.params.id), role: "P"},
      select:{
        id: true,
        role: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    }).catch(e=>{
      throw new DataBaseException("Internal Server Error");
      
    });
  };

  getMyInscriptions = async(req)=>{
    const userData = await serviceUtils.getUserByToken(req);

    return await this.prisma.eventInscriptions.findMany({where: {userId: userData.id},
      select:{
        id:true,
        role: true,
        event:{
          select:{
            id: true,
            name: true,
            description: true,
          }
        }
      }
    }).catch(e=>{
        throw new DataBaseException("Internal Server Error");

    })
  };

  startEvent = async (req)=>{
    const userData = await serviceUtils.getUserByToken(req);
    const event = await this.prisma.event.findFirst({where: {id: parseInt(req.params.id)}});
    
    if(!event){
      throw new NotFoundException("Event not Found");      
    }

    const inscriptions = await this.prisma.eventInscriptions.findMany({where:{eventId: event.id, role: "P"}});
    const matchesAlreadyExists = await this.prisma.match.findMany({where: {eventId: event.id}})

    if(matchesAlreadyExists[0] != null){
      throw new ConflictException("Event Already started");
    }


    if(! await this.isUserOwner(userData, event.id)){
      throw new ConflictException("You do not own this tournment");
    }
    
    const now = new Date();
    const eventStartDate = event.startDate;
    const eventId = event.id
    const total = inscriptions.length
    
    const totalRounds = Math.log2(total);
    
    if (!Number.isInteger(totalRounds)) {
      throw new ConflictException("The total numbers of players needs to be an perfect square root of 2");
    }
    
    
    if (now < eventStartDate) {
      throw new ConflictException(`The event cannot start before its startDate: (${eventStartDate.toLocaleString()}).`);
    }
    
    if (total < 2) {
      throw new ConflictException('Inscriptions not sufficient');
    }
    
    
    const matches = [];
    let currentTime = new Date(Date.now () + 10 * 60 * 1000);; 
    await this.prisma.event.update({where: {id: eventId}, data:{
      keysQuantity: totalRounds,
      matchsQuantity: total/2,
      status: "O"
    }})      

    let Matchs = [];
    if(event.multiplayer == false){
      for (let i = 0; i < total; i += 2) {
        const firstUserId = inscriptions[i].userId;
        const secondUserId = inscriptions[i + 1].userId;

        const match = await this.prisma.match.create({
          data: {
            eventId,
            keyNumber: 1,
            firstUserId,
            secondUserId,
            time: new Date(currentTime),
          },
          select:{
            firstUser: {
              select: {
                id: true,
                username: true,
                email: true
              }
            },
            secondUser: {
              select: {
                id: true,
                username: true,
                email: true
              }
            },
            event: {
              select: {
                name: true,
                id: true
              }
            },
            firstTeam: {
              select:{
                id:true,
                name: true
              }
            },
            secondTeam: {
              select:{
                id:true,
                name: true
              }
            },
          }
        }).catch(e => {
          throw new DataBaseException(e);
        });
        matches.push(match);
        currentTime = new Date(currentTime.getTime() + 10 * 60 * 1000);
      }
    }else{
      for (let i = 0; i < total; i += 2) {
        const firstTeamId = inscriptions[i].teamId;
        const secondTeamId = inscriptions[i + 1].teamId;
        const match = await this.prisma.match.create({
          data: {
            eventId,
            keyNumber: 1,
            firstTeamId,
            secondTeamId,
            time: new Date(currentTime),
          },
        }).catch(e => {
          throw new DataBaseException("Error while creating match");
        });
        matches.push(match);
        currentTime = new Date(currentTime.getTime() + 10 * 60 * 1000);
      }
    }
    return matches;
  };

  
  
  invitePlayer = async (req)=>{
    const userData = req.user
    const event = await this.prisma.event.findFirst({where:{id: parseInt( req.params.id)}}).catch(e=>{
      throw new NotFoundException("Event not found");
    })
      
    const userTo = await this.prisma.user.findFirst({where: {id: parseInt(req.body.id)}}).catch(e=>{
      throw new NotFoundException("User not Found");
      
    })

    if(!userTo){
      throw new NotFoundException("User not found");
      
    }
    if(!event){
      throw new NotFoundException("Event not found");
      
    }

    if(! await this.isUserOwner(userData, event.id)){
      throw new NotAllowedException("You are not the owner of this tournment");
    }

    await inviteModel.inviteToTournment(userTo, userData,event).then(r=>{
      return {msg: "Invite Sent"}
    })
  } 
  

  updateInvite = async(req)=>{
    const userData = req.user;

    const accept = req.body.accept == 'true'? true : false

    const invite = await inviteModel.inviteValidation(req.query.token);
    if(invite ==false || !invite){
      throw new NotAllowedException("Invite Expired or already used");
      
    }

    const event = invite.event
    if(invite.toUser.id != userData.id){
      throw new NotAllowedException("Only the user invited can accept his invite");
    }

    if(req.body.accept == undefined || accept == true){
      await this.prisma.$transaction(async(tx)=>{
        await tx.invite.update({where: {id: invite.id}, data:{
          status: "A"
        }})

        await tx.eventInscriptions.create({
          data:{
            userId: userData.id,
            eventId: event.id,
            role: "P",
            status: "O"
          }
        }).catch(e=>{
          if(e.code = "P2002"){
            throw new ConflictException("User already inscribed")
          }else{
            throw new DataBaseException("Internal server error");
            
          }
        })
      
      })
    }
    if(accept == false){
        await this.prisma.invite.update({where: {id: invite.id}, data:{
          status: "D"
        }})

      return {msg: 'Invite Denied'}
    }


  }
  
  // Funções de utiliddade do modelo

  //verifica se o user é dono do evento
  isUserOwner = async (user, eventId)=>{
      
    const ownerInscrition = await this.prisma.eventInscriptions.findFirst({where: {userId: user.id, eventId: eventId, role: "O"}});

    if(ownerInscrition || user.role == "A"){
      return true
    }else{
      return false
    }
  }

  

};

export default new EventModel();
