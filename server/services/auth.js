import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
import 'dotenv/config';


const prisma = new PrismaClient()

const auth = {
    
    login: async(req)=> {
        const {email, password} = req.body
        
        const registeredUser = await prisma.user.findFirst(
            { where: { email }}
        ).catch(
            (err) => {
                throw err;
            }
        );

        if (!registeredUser || registeredUser.status == "D")
            throw new Error("User not found") ;

    
        // Validar a SENHA do Usuário
        if (!bcrypt.compareSync(password, registeredUser.password) )
            throw new Error("User email or password invalid") ;


        if(registeredUser.id){

            return { token: jwt.sign(
                {
                    id: registeredUser.id,
                    email: registeredUser.email,
                }, 
                // Secret or Private Key
                process.env.JWT_SECRET,
                // Options
                {
                    expiresIn: '1h'
                }
            ), id: registeredUser.id ,username: registeredUser.username, email: registeredUser.email, role: registeredUser.role};
    
        }
        }

}


export default auth;