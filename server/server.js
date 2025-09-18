import express from "express";
import 'dotenv/config';
import router from "./routes/router.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from "./docs/swagger.js";
import notificationSocket from "./middlewares/webSocketsMiddleware.js";
import { Server } from "socket.io";
import errorHandler from "./middlewares/errorHandler.js";
import http from "http";
const app = express();


app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended: true}))


const corsOptions = {
  origin: "http://localhost:5173", 
  credentials: true
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors(corsOptions));


app.use(router)
app.use(errorHandler)

const server = http.createServer(app); 
server.listen(process.env.PORT, () => {
  console.log("connect: ", process.env.PORT);
});


export const io = new Server(server,{
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
})



notificationSocket(io);