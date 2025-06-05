
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

    if(parseInt(req.body.maxPlayers) %2 !=0){
      throw new Error("Player quantity must be even")
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


  inscribe: async(req)=>{
    const userData = await serviceUtils.getUserByToken(req);

    const isUserAlreadyInscribed = await prisma.eventInscriptions.findFirst({where: {
        userId: userData.id,
        eventId: parseInt(req.params.id)
    }})

    if(isUserAlreadyInscribed){
      throw new Error("User already inscribed")
    }
    
    
    await prisma.$transaction([
      prisma.eventInscriptions.create({
      data: {
        userId: userData.id,
        eventId: parseInt(req.params.id)
      }
    })
    
    ]) 
      


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

  unsubscribe: async(req)=>{
      const userData = await serviceUtils.getUserByToken(req);
      const userInscriptionByToken = await prisma.eventInscriptions.findFirst({where:{
        userId: userData.id, eventId: parseInt(req.params.id)
      }})

      const playersInscribeds = prisma.eventInscriptions.count({where: {eventId: parseInt(req.params.id)}})


      if(userInscriptionByToken == null && userData.role!= "A"){
        throw new Error("You are not inscribed in this event")
        
      }
      
      if((req.body.userId != null && req.body.userId != "") && (userData.role == "A" || userData.role == "O")){
        
        const userInscriptionByReqId = await prisma.eventInscriptions.findFirst({where:{
          userId: parseInt(req.body.userId), eventId: parseInt(req.params.id)
        }})
        
        
        if(userInscriptionByReqId == null){
          throw new Error("This user is not inscribed in this event")
        }    
        
        
        if(userData.role == "A"){
        await prisma.$transaction([
         prisma.eventInscriptions.delete({where: {id: userInscriptionByReqId.id}}),
        prisma.event.update({where: {id:  parseInt(req.params.id) }, data:{
          maxPlayers: playersInscribeds+1
        }})
    
    ]) 
        }
        
      if(userData.role == "O" && userInscriptionByToken.role != "O"){
          throw new Error("This user is not owner of this event")
      }
      if(userInscriptionByReqId.userId == userData.id){
        throw new Error("A owner cannot unsubscribe itself")
      }      

      if(userInscriptionByToken.role == "O"){
        await prisma.$transaction([
         prisma.eventInscriptions.delete({where: {id: userInscriptionByReqId.id}})
    
    ])       }
      }

      if(userData.role == "P" && userInscriptionByToken.userId == userData.id){
                await prisma.$transaction([
        await prisma.eventInscriptions.delete({where: {id: userInscriptionByToken.id}})
    
    ]) 
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
        throw new Error("O número total de jogadores deve ser uma potência de 2 (ex: 2, 4, 8, 16...)");
      }


    if (now < eventStartDate) {
      console.log(`Os matches não podem ser gerados antes da data de início do evento (${eventStartDate.toLocaleString()}).`);
      return;
    }

    if (total < 2) {
      console.log('Inscrições insuficientes para gerar matches.');
      return;
    }

    if (total % 2 !== 0) {
      console.log(total)
      console.log(`Número ímpar de inscrições. É necessário um número par para gerar os matches.`);
      return;
    }

      const matches = [];
      let matchNumber =1;
      let currentTime = new Date(Date.now () + 10 * 60 * 1000);; 
        
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

      }
};

export default eventService;
