
import { PrismaClient } from '@prisma/client';
import serviceUtils from './util.js';
const prisma = new PrismaClient();

const eventService = {

  getAll: async (req) => {

    return await prisma.event.findMany();
  },

  getById: async (req) => {
    return await prisma.event.findUnique({
      where: { id: parseInt(req.params.id) },
    }).catch(e=>{
      
      throw new Error("Event not found");
    });
  },

  create: async (req) => {

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
    
    if(userData.role == "O" || userData.role == "A"){
      const newEvent = await prisma.event.create({
        
        data: {...req.body, maxPlayers: parseInt(req.body.maxPlayers) ,eventInscriptions: {
          create:[
            {userId: userData.id, status: "C", role: "O"}
          ]
        }},
      });
  
      return newEvent;
    }else{
      throw new Error("user is not a Event Organizer")
    }
    

  },

  update: async (req) => {
    const userData = await serviceUtils.getUserByToken(req);

    const userInscription = await prisma.eventInscriptions.findFirst({where: {
      userId: userData.id, eventId: parseInt(req.params.id)
    }})


    if(userInscription == null && userData.role != "A"){
      throw new Error("You are not owner of this event")
    }
    if(userData.role == "A"){
    return await prisma.event.update({where: {id: parseInt(req.params.id)},
      data:{
        ...req.body
      }
      
    })
    }

    if(userInscription.role == "O"){
    return await prisma.event.update({where: {id: parseInt(req.params.id)},
      data:{
        ...req.body
      }
      
    })
    }else{
        throw new Error("User is not a Owner of this event")

    }
    


  },
inscribe: async (req) => {
  const userData = await serviceUtils.getUserByToken(req);

  const eventId = parseInt(req.params.id);
  if (isNaN(eventId)) throw new Error("Invalid event ID");

  const event = await prisma.event.findFirst({ where: { id: eventId } });
  if (!event) throw new Error("Event not found");
  if(event.keysQuantity != null){
    throw new Error("Event already started");
  }

  const isUserAlreadyInscribed = await prisma.eventInscriptions.findFirst({
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
    const team = await prisma.team.findFirst({ where: { id: teamId } });

    if (!team) {
      throw new Error("Team does not exist");
    }

    if (team.ownerId === userData.id) {
      return prisma.eventInscriptions.create({
        data: {
          teamId: team.id,
          eventId: eventId,
        },
      });
    } else {
      throw new Error("You are not the owner of this team");
    }
  }

  // Caso seja inscrição individual
  return prisma.eventInscriptions.create({
    data: {
      userId: userData.id,
      eventId: eventId,
    },
  });
},


  delete: async (req) => {
    const userData = await serviceUtils.getUserByToken(req);

    const userInscription = await prisma.eventInscriptions.findFirst({where: {
      userId: userData.id, eventId: parseInt(req.params.id)
    }})



    if(userData.role == "A"){
    return await prisma.event.delete({where: {id: parseInt(req.params.id)},
    })
    }

    if(userInscription.role == "O"){
    return await prisma.event.delete({where: {id: parseInt(req.params.id)},

    })
    }else{
        throw new Error("User is not a Owner of this event")

    }
    
  },
  unsubscribe: async (req) => {
    const userData = await serviceUtils.getUserByToken(req);
    const eventId = parseInt(req.params.id);
    const isAdmin = userData.role === "A";
    const isOwner = userData.role === "O";
    const isPlayer = userData.role === "P";

    const event = await prisma.event.findFirst({ where: { id: eventId } });
    if (!event) throw new Error("Event not found");

    const isMultiplayer = event.multiplayer;

    const userInscriptionByToken = await prisma.eventInscriptions.findFirst({
      where: isMultiplayer
        ? { eventId, teamId: userData.teamId }
        : { eventId, userId: userData.id },
    });

    const playersInscribeds = await prisma.eventInscriptions.count({ where: { eventId } });

    if (!userInscriptionByToken && !isAdmin) {
      throw new Error("You are not inscribed in this event");
    }

    const reqId = parseInt(req.body.userId); 

    if (req.body.userId != null && req.body.userId !== "" && (isAdmin || isOwner)) {
      const userInscriptionByReqId = await prisma.eventInscriptions.findFirst({
        where: isMultiplayer
          ? { eventId, teamId: reqId }
          : { eventId, userId: reqId },
      });

      if (!userInscriptionByReqId) {
        throw new Error("This participant is not inscribed in this event");
      }

      if (isAdmin) {
        return await prisma.$transaction([
          prisma.eventInscriptions.delete({ where: { id: userInscriptionByReqId.id } }),
          prisma.event.update({
            where: { id: eventId },
            data: { maxPlayers: playersInscribeds + 1 },
          }),
        ]);
      }

      if (isOwner) {
        if (userInscriptionByToken.role !== "O") {
          throw new Error("You are not the owner of this event");
        }
        if (
          (isMultiplayer && userInscriptionByReqId.teamId === userData.teamId) ||
          (!isMultiplayer && userInscriptionByReqId.userId === userData.id)
        ) {
          throw new Error("An owner cannot unsubscribe itself");
        }

        return await prisma.eventInscriptions.delete({
          where: { id: userInscriptionByReqId.id },
        });
      }
    }

    if (isPlayer && userInscriptionByToken) {
      return await prisma.eventInscriptions.delete({
        where: { id: userInscriptionByToken.id },
      });
    }

  },


  getAllInscriptions: async(req)=>{
    return await prisma.eventInscriptions.findMany({where: {eventId: parseInt(req.params.id) }, include:{
      user: {
        select:{
          username:true, email:true, id:true
        }
      }
    }}); 
  },

  startEvent: async (req)=>{
    
    
    const userData = await serviceUtils.getUserByToken(req);
    const inscriptions = await eventService.getAllInscriptions(req);
    const event = await prisma.event.findFirst({where: {id: parseInt(req.params.id)}});
    const matchesAlreadyExists = await prisma.match.findMany({where: {eventId: event.id}})

    if(matchesAlreadyExists[0] != null){
      throw new Error("Event Already started");
      
    }

    const ownerInscrition = await prisma.eventInscriptions.findFirst({where: {userId: userData.id}});
  
    if(ownerInscrition.role != "O" && userData.role != "A"){
      throw new Error("You do not own this tournment");
    }

    const now = new Date();
    const eventStartDate = event.startDate;
    const eventId = event.id
    const total = inscriptions.length-1

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

    if (total % 2 !== 0) {
      throw new Error(`The number of inscriptions is odd, and is not sufficient to start the event`);
    }

      const matches = [];
      let matchNumber =1;
      let currentTime = new Date(Date.now () + 10 * 60 * 1000);; 
      await prisma.event.update({where: {id: eventId}, data:{
        keysQuantity: totalRounds,
        matchsQuantity: total/2
      }})      
      if(event.multiplayer == false){
        for (let i = 0; i < total; i += 2) {
            const firstUserId = inscriptions[i].userId;
            const secondUserId = inscriptions[i + 1].userId;
                  
            const match = await prisma.match.create({
                data: {
                    eventId,
                    matchNumber: matchNumber++,
                    keyNumber: 1,
                    firstUserId,
                    secondUserId,
                    time: new Date(currentTime),
                },
            }).catch(e => {
                throw new Error("Error while creating match");
            });
          
            matches.push(match);
            
            currentTime = new Date(currentTime.getTime() + 10 * 60 * 1000);
        }

      }else{

        for (let i = 0; i < total; i += 2) {
            const firstTeamId = inscriptions[i].teamId;
            const secondTeamId = inscriptions[i + 1].teamId;
                  
            const match = await prisma.match.create({
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

      }
};

export default eventService;
