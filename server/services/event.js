
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

    console.log(userData)

    if(userData.role == "O" || userData.role == "A"){
      const newEvent = await prisma.event.create({
  
        data: {...req.body, eventInscriptions: {
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

    return await prisma.eventInscriptions.create({
      data: {
        userId: userData.id,
        eventId: parseInt(req.params.id)
      }
    })


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
          console.log("Eu cheguei aqui")
          await prisma.eventInscriptions.delete({where: {id: userInscriptionByReqId.id}})
        }
        
      if(userData.role == "O" && userInscriptionByToken.role != "O"){
        console.log("Role do usuário: " +userData.role)
        console.log("Role do usuário no evento: " + userInscriptionByToken.role)
        console.log(userData.role == "O" && userInscriptionByToken != "O")
          throw new Error("This user is not owner of this event")
      }
      if(userInscriptionByReqId.userId == userData.id){
        throw new Error("A owner cannot unsubscribe itself")
      }      

      if(userInscriptionByToken.role == "O"){
        await prisma.eventInscriptions.delete({where: {id: userInscriptionByReqId.id}})
      }
      }

      if(userData.role == "P" && userInscriptionByToken.userId == userData.id){
        await prisma.eventInscriptions.delete({where: {id: userInscriptionByToken.id}})
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
