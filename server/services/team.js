import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const teamService = {


  getAll: () => {
    return prisma.team.findMany()
  },

  getById: (req) => {
    return prisma.team.findFirst({where: {
      id: parseInt(req.params.id)
    }})

  },

  create: (req) => {
    const { name, ownerId, description } = req.body;

    return prisma.team.create({
    data:{
      name,
      description,
      ownerId: parseInt(ownerId)
    }}).catch(e=>{
      return e;
    })
    
  },

  update: (req) => {
    const { name, description } = req.body;

    return prisma.team.update({where: {id: parseInt(req.params.id)},
      data:{
        name, description
  }})
  },

  delete: (req) => {
    return prisma.team.delete({where: {id: parseInt(req.params.id)}})
  },
};

export default teamService;
