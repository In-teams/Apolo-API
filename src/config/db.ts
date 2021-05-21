import * as dotenv from "dotenv";
import { knex } from "knex";
dotenv.config();

class db {
  connection() {
    const { DB_NAME, DB_HOST, DB_PASS, DB_USER } = process.env;
    const config = knex({
      client: "mysql",
      connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
      },
    });
    return config;
  }
}

export default new db().connection;
