import { Pool } from "pg";
import { config } from "dotenv";

config();

const pool = new Pool({
    host: process.env['HOST'],
    user: process.env['USER'],
    password: process.env['PASSWORD'],
    port: 5432
});

export default {
    query : (text: string, params?: Array<any>) => pool.query(text, params)
};