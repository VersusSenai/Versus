import connection from "./config/connection.js";
import express from "express";
import mysql  from "mysql2";
import 'dotenv/config';
import router from "./routes/router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get("/some-route", (req, res) => {
  res.send("Route works!");
});
app.use(router)

app.listen(process.env.PORT, () => {
  console.log("connect: ", process.env.PORT);
});
