import express from "express";
import cors from "cors";
import https from "https";
import fs from "fs";

const port = 4000;
const app = express();

app.use(cors());

const options = {
    key: fs.readFileSync("./certificate/key.pem"),
    cert: fs.readFileSync("./certificate/cert.pem")
}

https.createServer(options, app).listen(port, () => {
    console.log(`server is running (port: ${port})`);
})