import connection from "./config/connection.js";
import express from "express";
import mysql from "mysql2";
import "dotenv/config";

const app = express();

app.use(express.json());

app.get("/some-route", (req, res) => {
  res.send("Route works!");
});

app.listen(process.env.PORT, () => {
  console.log("connect: ", process.env.PORT);
});
