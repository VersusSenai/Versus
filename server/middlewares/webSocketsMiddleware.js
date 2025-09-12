import { parse } from "cookie";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import util from "../services/util.js";
export const socketToUser = new Map();
export const userMap = new Map();

const notificationSocket = (io) => {

    io.use(async (socket, next) => {
      const session = socket.request.headers.cookie;
      if(!session){
        return next(new Error("not authorized"))
      }

      const cookies = parse(session);
      if(!cookies.token){
        return next(new Error("not authorized"))
      }

      let cookiesRequest = {cookies: cookies};
        const {token} = cookies;
        await jwt.verify(
            token,
            process.env.JWT_SECRET, 
            async (err, authData) => {
                if (err) {
                    next(new Error("not authorized"))
                }
                if(authData){
                    const user = await util.getUserByToken(cookiesRequest)

                    socketToUser.set(socket.id, user);
                    userMap.set(user.id, socket.id);
                }
            })
          
   
        next();
    
    
    });
    
    
    io.on("connection", (socket) => {

        console.log("a user connected", socketToUser.get(socket.id));
    })
}



export default notificationSocket;