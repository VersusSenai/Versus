import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import NotFoundException from "../exceptions/NotFoundException";
const prisma = new PrismaClient();

class UtilService {


    getUserByToken= async(req)=>{
        
            const {token}= req.cookies

            if(!token){
                throw Error("Token is undefined")
            }

           const data = jwt.decode(token)
            


           return await prisma.user.findUnique({where: {id: data.id}, select:{
          
                username:true, email:true, id:true, role:true, password: true
            
           }}).catch(e =>{
                throw Error("User does not exists")
           })

    }

}

export default new UtilService();