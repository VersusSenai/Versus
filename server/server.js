import express from "express";
import 'dotenv/config';
import router from "./routes/router.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.use(router)

app.listen(process.env.PORT, () => {
  console.log("connect: ", process.env.PORT);
});
