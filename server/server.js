import express from "express";
import 'dotenv/config';
import router from "./routes/router.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from "./docs/swagger.js";
const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended: true}))
const corsOptions = {
  origin: "http://localhost:5173", // seu front-end
  credentials: true
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors(corsOptions));


app.use(router)

app.listen(process.env.PORT, () => {
  console.log("connect: ", process.env.PORT);
});
