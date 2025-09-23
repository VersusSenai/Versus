import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"
import NotFoundException from "../exceptions/NotFoundException.js";
const prisma = new PrismaClient();

class UtilService {

   getFullUrl = (req) => {
        return req.protocol + '://' + req.get('host');
    }
    getUserByToken= async(req)=>{
        
            const {token}= req.cookies

            if(!token){
                throw Error("Token is undefined")
            }

           const data = jwt.decode(token)
            


           return await prisma.user.findUnique({where: {id: data.id}, select:{
          
                username:true, email:true, id:true, role:true, password: true, icon: true
            
           }}).catch(e =>{
                throw Error("User does not exists")
           })

    }

}

export default new UtilService();