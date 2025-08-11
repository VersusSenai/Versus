import { EventRole, PrismaClient } from '@prisma/client';
import serviceUtils from '../services/util.js';

class EventModel {
  
  constructor() {
    this.prisma = new PrismaClient();
  }

  getAll = async (req) => {
    return await this.prisma.event.findMany();
  };


  getById = async (req) => {
    return await this.prisma.event.findUnique({
      where: { id: parseInt(req.params.id) },
    }).catch(e=>{
      throw new Error("Event not found");
    });
  };

  create = async (req) => {
    const userData = await serviceUtils.getUserByToken(req);
    const now = new Date();

    if(now > Date.parse(req.body.startDate)){
      throw new Error("Event start date cannot be before today");
    }
    if(Date.parse(req.body.startDate) > Date.parse(req.body.endDate)){
      throw new Error("Event start date cannot be after endDate");
    }
    if(parseInt(req.body.maxPlayers) %2 !=0){
      throw new Error("Player quantity must be even")
    }
    if(req.body.multiplayer == "true"){
      req.body.multiplayer = true
    }else{
      req.body.multiplayer = false
    }
    
    const newEvent = await this.prisma.event.create({
      data: {...req.body, maxPlayers: parseInt(req.body.maxPlayers) ,eventInscriptions: {
        create:[
          {userId: userData.id, status: "C", role: "O"}
        ]
      }},
    });
    
    return newEvent;


  };

  update = async (req) => {
    const isUserOwner = this.isUserOwner(req.user, parseInt(req.params.id))
    if(!isUserOwner){
      throw new Error("Only the owner of this event can update it");
    }

    return await this.prisma.event.update({where: {id: parseInt(req.params.id)},
      data:{
        ...req.body
      }
    })

  };

  inscribe = async (req) => {

    const userData = req.user;
    const eventId = parseInt(req.params.id);

    const event = await this.prisma.event.findFirst({ where: { id: eventId } });

    if (!event) throw new Error("Event not found");
    if(event.keysQuantity != null){
      throw new Error("Event already started");
    }

    const isUserAlreadyInscribed = await this.prisma.eventInscriptions.findFirst({
      where: {
        userId: userData.id,
        eventId: eventId,
      },
    });

    if (isUserAlreadyInscribed) {
      throw new Error("User already inscribed");
    }

    const teamId = req.body.teamId ? parseInt(req.body.teamId) : null;

    if (teamId != null && !isNaN(teamId)) {
      const team = await this.prisma.team.findFirst({ where: { id: teamId } });

      if (!team) {
        throw new Error("Team does not exist");
      }

      if (team.ownerId === userData.id) {
        return this.prisma.eventInscriptions.create({
          data: {
            teamId: team.id,
            eventId: eventId,
            role: "P",
            status: "O"
          },
        });
      } else {
        throw new Error("You are not the owner of this team");
      }
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

  };

  delete = async (req) => {

    const isUserOwner = this.isUserOwner(req.user, parseInt(req.params.id));

    if(!isUserOwner){
      throw new Error("User is not owner of this event");
    }

    return await this.prisma.event.delete({where: {id: parseInt(req.params.id)}});

  }

  unsubscribe = async (req) => {
    const userData = req.user;
    const eventId = parseInt(req.params.id);

    const event = await this.prisma.event.findFirst({ where: { id: eventId } });

    if (!event) throw new Error("Event not found");
    if(event.keysQuantity != null){
      throw new Error("Event already started");
    }

    const userInscription = await this.prisma.eventInscriptions.findFirst({where: {userId: userData.id, eventId}})
    if(!userInscription){
      throw new Error("User not inscribed");

    }

    if(userInscription != null && userInscription.role == "P"){
      await this.prisma.eventInscriptions.update({where: {id: userInscription.id}, data:{role: "R"}})
    }else{
      throw new Error("Owner cannot unsubscribe himself");
      
    }

  };

  unsubscribeByUserId = async (req) => {
    const eventId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);
    const teamId = parseInt(req.params.teamId);

    const event = await this.prisma.event.findFirst({ where: { id: eventId } });

    if (!event) throw new Error("Event not found");
    if(event.keysQuantity != null){
      throw new Error("Event already started");
    }

    const isUserOwner = this.isUserOwner(req.user, eventId);

    if(!isUserOwner){
      throw new Error("User is not Owner of this event");
      
    }

    if(!isNaN(teamId) && teamId!= null){
      const teamInscription = await this.prisma.eventInscriptions.findFirst({where: {userId: userId, eventId}})
  
      if(!teamInscription){
      throw new Error("Team not inscribed");

      }
      if(teamInscription != null && teamInscription.role == "P"){
        await this.prisma.eventInscriptions.delete({where: {id: teamInscription.id}, data:{role: "R"}})
      }else{
        throw new Error("Owner cannot unsubscribe himself");
        
      }

    }
    const userInscription = await this.prisma.eventInscriptions.findFirst({where: {userId: userId, eventId}})
    
    if(!userInscription){
      throw new Error("User not inscribed");

    }
    if(userInscription != null && userInscription.role == "P"){
      await this.prisma.eventInscriptions.delete({where: {id: userInscription.id}, data:{role: "R"} })
    }else{
      throw new Error("Owner cannot unsubscribe himself");
      
    }

  };

  getAllInscriptions = async(req)=>{
    const userData = await serviceUtils.getUserByToken(req);
    const isOwner = this.isUserOwner(req.user, parseInt(req.params.id));

    if(!isOwner){
      throw new Error("Only the owner of this event can make this call");
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
    })
  };

  startEvent = async (req)=>{
    const userData = await serviceUtils.getUserByToken(req);
    const event = await this.prisma.event.findFirst({where: {id: parseInt(req.params.id)}});
    const inscriptions = await this.prisma.eventInscriptions.findMany({where:{eventId: event.id, role: "P"}});
    const matchesAlreadyExists = await this.prisma.match.findMany({where: {eventId: event.id}})

    if(matchesAlreadyExists[0] != null){
      throw new Error("Event Already started");
    }

    const ownerInscrition = await this.prisma.eventInscriptions.findFirst({where: {userId: userData.id, eventId: event.id}});
    if(!ownerInscrition){
      throw new Error("You do not own this tournment");
    }
    if(ownerInscrition.role != "O" && userData.role != "A"){
      throw new Error("You do not own this tournment");
    }
    
    const now = new Date();
    const eventStartDate = event.startDate;
    const eventId = event.id
    const total = inscriptions.length
    
    const totalRounds = Math.log2(total);
    
    if (!Number.isInteger(totalRounds)) {
      throw new Error("The total numbers of players needs to be an perfect square root of 2");
    }
    
    
    if (now < eventStartDate) {
      throw new Error(`The event cannot start before its startDate: (${eventStartDate.toLocaleString()}).`);
    }
    
    if (total < 2) {
      throw new Error('Inscriptions not sufficient');
    }
    
    
    const matches = [];
    let matchNumber =1;
    let currentTime = new Date(Date.now () + 10 * 60 * 1000);; 
    await this.prisma.event.update({where: {id: eventId}, data:{
      keysQuantity: totalRounds,
      matchsQuantity: total/2
    }})      

    let Matchs = [];
    if(event.multiplayer == false){
      for (let i = 0; i < total; i += 2) {
        const firstUserId = inscriptions[i].userId;
        const secondUserId = inscriptions[i + 1].userId;

        const match = await this.prisma.match.create({
          data: {
            eventId,
            matchNumber: matchNumber++,
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
          throw new Error(e);
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
            matchNumber: matchNumber++,
            keyNumber: 1,
            firstTeamId,
            secondTeamId,
            time: new Date(currentTime),
          },
        }).catch(e => {
          throw new Error("Error while creating match");
        });
        matches.push(match);
        currentTime = new Date(currentTime.getTime() + 10 * 60 * 1000);
      }
    }
    return matches;
  };

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
