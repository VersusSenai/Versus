import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const eventService = {

  getAll: async() => {
    return await prisma.event.findMany();
  },

  getById: async (req) => {
    return await prisma.event.findFirst({where: {id: parseInt(req.params.id)}, 
      include: {
        eventInscriptions: {
          where: {
            role: "O"
          },
          include: {
            user: {
             select: {username: true, email: true, id: true}
            }
          }
        }
      }
  })
    .catch(e=>{
      return e;
    })
  },

  create: async (req) => {
    const { name, description, start_date, end_date, model, status, userId } = req.body;
          
    return await  prisma.event.create({
        data:{
          name, description, startDate: start_date, endDate: end_date, model, status, 
          eventInscriptions:{
            create:{
              userId: parseInt(userId), role: "O", status: "C"
            }
          }
        
        }
      }).catch(e =>{
        return e     
      })
    


  },

  update: async(req) => {
    const { name, description, start_date, end_date, model, status } = req.body;

    return await prisma.event.update({where: {id: parseInt(req.params.id)}, data:{
      name, description, startDate: start_date, endDate: end_date, model, status 
    }})

  },

  delete: async(req) => {
    return await prisma.event.delete({where :{id: parseInt(req.params.id)}})
    .catch(e=>{
      return e;
    })
  },
};

export default eventService;
