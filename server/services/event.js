
import { PrismaClient } from '@prisma/client';
import serviceUtils from './util.js';
const prisma = new PrismaClient();

const eventService = {
  getAll: async (req) => {

    return await prisma.event.findMany();
  },

  getById: async (req) => {
    return await prisma.event.findUnique({
      where: { id: Number(req.params.id) },
    });
  },

  create: async (req) => {

    const userData = await serviceUtils.getUserByToken(req);

    if(userData.role != "O"){
      throw new Error("user is not a Event Organizer")
    }


    const newEvent = await prisma.event.create({

      data: {...req.body, eventInscriptions: {
        create:[
          {userId: userData.id, status: "C", role: "O"}
        ]
      }},
    });

    return newEvent;
  },

  update: async (req) => {
    const userData = await serviceUtils.getUserByToken(req);

    const userInscription = await prisma.eventInscriptions.findFirst({where: {
      userId: userData.id, eventId: parseInt(req.params.id)
    }})


    if(userInscription.role != "O"){
      throw new Error("User is not a Owner of this event")
    }

    return await prisma.event.update({where: {id: parseInt(req.params.id)},
      data:{
        ...req.body
      }
      
    })

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

    return await prisma.eventInscriptions.create({
      data: {
        userId: userData.id,
        eventId: parseInt(req.params.id)
      }
    })


  },

  delete: async (req) => {
    try {
      const deletedEvent = await prisma.event.delete({
        where: { id: Number(req.params.id) },
      });
      return deletedEvent;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new Error("Evento não encontrado");
      }
      throw err;
    }
  },

  unsubscribe: async(req)=>{
      const userData = await serviceUtils.getUserByToken(req);
    
      const userInscription = await prisma.eventInscriptions.findFirst({where:{
        userId: userData.id, eventId: parseInt(req.params.id)
      }})

      if(!userInscription){
        throw new Error("User is not inscribed in this tournment")  

      }

      if(userInscription.role == "O" && parseInt(req.body.userId) == userData.id){
        throw new Error("Owner user cannot unscribe itself")  
      }

      if(userInscription.role == "O" && req.body.userId == null || req.body.userId == ""){
        throw new Error("UserId is empty")
      }

      if(userInscription.role == "O" && parseInt(req.body.userId) != userData.id){
        await prisma.eventInscriptions.delete({
          where: {
            userId_eventId:  {
              userId:parseInt(req.body.userId), 
              eventId: parseInt(req.params.id)}

          }
        })
      }
      else{
        await prisma.eventInscriptions.delete({
          where: {
            userId_eventId:
            {userId: userData.id, eventId: parseInt(req.params.id)}

          }
        })
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
  }
};

export default eventService;
