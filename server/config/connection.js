import 'dotenv/config';
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.log("Error connecting to the database: " + err.stack);
    return err;
  }
  console.log("Connected to the database");
});

export default connection;