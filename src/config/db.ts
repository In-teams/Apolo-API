import mysql from "mysql";
import * as dotenv from "dotenv";
dotenv.config();

class db {
  connection() {
    const { DB_NAME, DB_HOST, DB_PASS, DB_USER } = process.env;
    const config = mysql.createConnection({
      user: DB_USER,
      host: DB_HOST,
      password: DB_PASS,
      database: DB_NAME,
    });

    config.connect((err) => console.log("database connect"));
  }
}

export default new db().connection;
