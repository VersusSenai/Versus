
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import serviceUtils from './util.js';


const teamService = {
  
  getAll: async () => {
    return await prisma.team.findMany();
  },

  getById: async (req) => {
    const team = await prisma.team.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    return team;
  },

  create: async (req) => {
    const userData = await serviceUtils.getUserByToken(req)

    return await prisma.team.create({
      data: {...req.body, ownerId: userData.id},
    });

 
  },

  update: async (req) => {
    const userData = await serviceUtils.getUserByToken(req)

    const team = await prisma.team.findFirst({where: {id: parseInt(req.params.id)}})

    if(team == null){
      throw new Error("Team not found")
    }

    if(team.ownerId != userData.id && userData.role != "A"){
      throw new Error("You do not own this team")
    }

    return await prisma.team.update({where: {id: team.id}, data:{
      ...req.body
    }})
  },

  delete: async (req) => {
    const userData = await serviceUtils.getUserByToken(req)

    const team = await prisma.team.findFirst({where: {id: parseInt(req.params.id)}})

    if(team == null){
      throw new Error("Team not found")
    }

    if(team.ownerId != userData.id && userData.role != "A"){
      throw new Error("You do not own this team")
    }

    return await prisma.team.delete({where: {id: team.id}})
  },


  inscribe: async (req) =>{
    const userData = await serviceUtils.getUserByToken(req)
    const team = await prisma.team.findFirst({where: {id: parseInt(req.params.id)}})

    if(team == null){
      throw new Error("Team not found")
    }

    return await prisma.teamUsers.create({data:{
      userId: userData.id,
      teamId: parseInt(req.params.id),
    }, })
  },

  unsubscribe: async(req)=>{
    const userData = await serviceUtils.getUserByToken(req);
    const userInscriptionByToken = await prisma.teamUsers.findFirst({where:{
      userId: userData.id, teamId: parseInt(req.params.id)
    }})
    
    
    const team = await prisma.team.findFirst({where: {id: parseInt(req.params.id)}})
    
    if(team == null){
      throw new Error("Team not found")
    }
    
    if(userInscriptionByToken == null && userData.role!= "A" && team.ownerId != userData.id){
      throw new Error("You are not inscribed in this team")
      
    }
    
    
    if(userInscriptionByToken!= null && userInscriptionByToken.userId == userData.id){
      return await prisma.teamUsers.delete({where:{ id: userInscriptionByToken.id}})
    }
    

    
    if((req.body.userId != null && req.body.userId != "") && (userData.role == "A" || team.ownerId == userData.id)){
      
      const userInscriptionByReqId = await prisma.teamUsers.findFirst({where:{
        userId: parseInt(req.body.userId), teamId: parseInt(req.params.id)
      }})
      
      
      if(userInscriptionByReqId == null){
        throw new Error("This user is not inscribed in this team")
      }    
      

      
      if((userData.role != "A" && team.ownerId != userData.id)){
        throw new Error("This user is not owner of this team")
      }
      
      if((userData.role == "A" || team.ownerId == userData.id)){
        return await prisma.teamUsers.delete({where: {id: userInscriptionByReqId.id}})
      }
    }
    
    
  },
  
  getAllInscriptions: async(req)=>{
    return await prisma.teamUsers.findMany({where: {teamId: parseInt(req.params.id)}, include:{
      user: {
        select:{
          id: true, username: true, email: true
        }
      }
    }})
  }
};

export default teamService;
