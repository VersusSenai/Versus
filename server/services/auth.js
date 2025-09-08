import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, Status } from "@prisma/client";
import 'dotenv/config';
import DataBaseException from '../exceptions/DataBaseException.js';
import NotFoundException from '../exceptions/NotFoundException.js';
import BadRequestException from '../exceptions/BadRequestException.js';


const prisma = new PrismaClient()

class Auth {
    

    constructor() {
      this.prisma = new PrismaClient();
    }

    login = async(req)=> {
        const {email, password, remember} = req.body
        
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
            await prisma.userRefreshToken.updateMany({  
                where: { userId: registeredUser.id, status: 'A' },
                data: { status: 'E' }
            }).catch(e=>{
                throw new DataBaseException("Internal Server Error");
            })
            if(remember == true){
                return {token: await this.generateToken(registeredUser), refreshToken: await this.generateRefreshToken(registeredUser) , id: registeredUser.id ,username: registeredUser.username, email: registeredUser.email, role: registeredUser.role};
            }else{
                return {token: await this.generateToken(registeredUser), refreshToken: '' , id: registeredUser.id ,username: registeredUser.username, email: registeredUser.email, role: registeredUser.role};

            }
    
        }
    }




    generateToken = async(user)=>{
        return await jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                }, 
                process.env.JWT_SECRET,
                {
                    expiresIn: '30m'
                }
            )
    }

    generateRefreshToken = async(user)=>{
        const refreshToken = await jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                }, 
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: '15d'
                }
            )
            
        await prisma.userRefreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expirationDate: new Date(new Date().setDate(new Date().getDate() + 15)) ,
                status: 'A'
            }
        }).catch(e=>{
            throw new DataBaseException("Internal Server Error");
        })


        return refreshToken;
        
    }


    refreshToken = async(req)=>{
        const {refreshToken} = req.cookies;
        if(!refreshToken){
            throw new BadRequestException("Refresh Token is required");
        }
        
        const storedToken = await prisma.userRefreshToken.findFirst({
            where: {
                token: refreshToken,    
            }, include: {
                user: true
            }
        }).catch(e=>{
            throw new DataBaseException("Internal Server Error");
        })

        if(!storedToken.status || storedToken.status != "A"){
            
            await prisma.userRefreshToken.updateMany({  
                where: { userId: storedToken.userId, status: 'A' },
                data: { status: 'E' }
            }).catch(e=>{
                throw new DataBaseException("Internal Server Error");
            })


            throw new BadRequestException("Invalid Refresh Token");
        }

        return await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, authData)=>{
            if(err){
                if (err.name === 'TokenExpiredError') {
                    await prisma.userRefreshToken.updateMany({  
                        where: { userId: storedToken.userId, status: 'A' },
                        data: { status: 'E' }
                    })
                    throw new BadRequestException("Refresh Token expired, please login again");
                }
                throw new DataBaseException("Internal Server Error");
                
            }else{

                await prisma.userRefreshToken.update({  
                    where: { id: storedToken.id },
                    data: { status: 'C' }
                })
                return {token: await this.generateToken(storedToken.user), refreshToken: await this.generateRefreshToken(storedToken.user) , id: storedToken.user.id ,username: storedToken.user.username, email: storedToken.user.email, role: storedToken.user.role};
            }
        }
    )


        
    }

}


export default new Auth();