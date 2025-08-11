import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
const prisma = new PrismaClient();

class UtilService {


    getUserByToken= async(req)=>{
        
            const {token}= req.cookies

            if(!token){
                throw Exception("Token is undefined")
            }

           const data = jwt.decode(token)



           return await prisma.user.findUnique({where: {id: data.id}, select:{
          
                username:true, email:true, id:true, role:true, password: true
            
           }}).catch(e =>{
            throw Exception("User does not exists")
           })

    }

}

export default new UtilService();