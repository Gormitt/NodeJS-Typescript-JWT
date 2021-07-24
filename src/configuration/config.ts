import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.SERVER_PORT || 4000;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    options: {
        key: fs.readFileSync("./certificate/key.pem"),
        cert: fs.readFileSync("./certificate/cert.pem")
    }
};

export default { server: SERVER };