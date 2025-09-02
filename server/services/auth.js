import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
import 'dotenv/config';
import DataBaseException from '../exceptions/DataBaseException.js';
import NotFoundException from '../exceptions/NotFoundException.js';
import BadRequestException from '../exceptions/BadRequestException.js';


const prisma = new PrismaClient()

class Auth {
    
    login = async(req)=> {
        const {email, password} = req.body
        
        if(!email || !password){
            throw new BadRequestException("Email and password are required");
        }

        const registeredUser = await prisma.user.findUnique(
            { where: { email: email }}
        ).catch(
            (err) => {
                throw new DataBaseException("Internal Server Error");
            }
        );

        if (!registeredUser || registeredUser.status == "D")
            throw new NotFoundException("User email or password invalid") ;

        
        
        // Validar a SENHA do Usuário
        if (!bcrypt.compareSync(password, registeredUser.password) )
            throw new BadRequestException("User email or password invalid") ;


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


export default new Auth();