import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, Status } from "@prisma/client";
import 'dotenv/config';
import DataBaseException from '../exceptions/DataBaseException.js';
import NotFoundException from '../exceptions/NotFoundException.js';
import BadRequestException from '../exceptions/BadRequestException.js';
import { OAuth2Client } from 'google-auth-library';

const prisma = new PrismaClient()

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:8080/auth/google/callback";

const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

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


    getFullUrl = (req) => {
        return req.protocol + '://' + req.get('host');
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


    generateAuthUrl = async(req)=>{
        return oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            ],
        });
    
    }
    googleCallback = async(req)=>{
        const code = req.query.code;
        try {
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);

            const ticket = await oauth2Client.verifyIdToken({
                idToken: tokens.id_token,
                audience: GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const { sub, email, name, picture } = payload;

            let user = await this.prisma.user.findUnique({ where: { email } });
            
            if (!user) {
                const hashedPassword = bcrypt.hashSync(sub, 10);
                user = await this.prisma.user.create({
                    data: {
                        email,
                        username: name,
                        password: hashedPassword,
                        role: "P",
                        status: "A",
                    }
                });

            }
            
            return {token: await this.generateToken(user), refreshToken: await this.generateRefreshToken(user) , id: user.id ,username: user.username, email: user.email, role: user.role};



        } catch (error) {
            throw new DataBaseException("Internal Server Error");
            
        }
    }

    discordAuthUrl = async(req)=>{
        const clientId = process.env.DISCORD_CLIENT_ID;
        const redirectUri = encodeURIComponent("http://localhost:8080/auth/discord/callback");
        const scope = "identify email";


        const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;

        return url;

    }

    discordCallback = async(req)=>{
        const code = req.query.code;
        const clientId = process.env.DISCORD_CLIENT_ID;
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;
        const url = this.getFullUrl(req);
        const redirectUri = url+"/auth/discord/callback";

        try {
            const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: redirectUri,
                }),
            });
            
            const tokenData = await tokenResponse.json();
            const userResponse = await fetch("https://discord.com/api/users/@me", {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                },
            });

            const {username, email, avatar,id, global_name} = await userResponse.json();
            let user = await this.prisma.user.findUnique({ where: { email } });
            
            if (!user) {
                const hashedPassword = bcrypt.hashSync(id, 10);
                user = await this.prisma.user.create({
                    data: {
                        email,
                        username: global_name? global_name : username,
                        password: hashedPassword,
                        role: "P",
                        status: "A",
                    }
                });
            }

            return {token: await this.generateToken(user), refreshToken: await this.generateRefreshToken(user) , id: user.id ,username: user.username, email: user.email, role: user.role};

        }catch (error) {
            throw new DataBaseException("Internal Server Error");
        }
    
    }

}


export default new Auth();