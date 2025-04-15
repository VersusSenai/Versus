import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const auth = {
    
    login: async(req)=> {
        const {email, password} = req.body
        
        const registeredUser = await prisma.user.findFirst(
            { where: { email }}
        ).catch(
            (err) => {
                console.log("Error: ", err);
            }
        );
    
        if (!registeredUser)
            return res
                .status(400)
                .json({message: "Email ou Senha inválidos."})
    
        if (!bcrypt.compareSync(password, registeredUser.password) )
            return res
                .status(400)
                .json({message: "Email ou Senha inválidos."})
        
        return jwt.sign(
            {
                id: registeredUser.id,
                email: registeredUser.email,
            }, 
            process.env.JWT_SECRET,
            // Options
            {
                expiresIn: '1h'
            }
        );

    }

}


export default auth;