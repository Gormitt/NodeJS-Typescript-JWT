// server library
import express from "express";
import https from "https";
import bodyParser from "body-parser";
import cors from "cors";
// logging system and configuration
import logging from "./configuration/logging";
import config from "./configuration/config";
// import routes
import sessions from "./routes/sessions";
import teachers from "./routes/teachers";
import dictionaries from "./routes/dictionaries";

const NAMESPACE = "Server";
const app = express();

/** loggin the request into the console */
app.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

    res.on("finish", () => {
        logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]\n`);
    });

    next();
});

/** parse the request (allow to send nested JSON, avoid nececity of parsing JSON in frontend) */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** corse middleware */
app.use(cors());

/** routes */
app.use("/sessions", sessions);
app.use("/teachers", teachers);
app.use("/", dictionaries);

/** unknown route handler - if we pass threw all routes to here, user wants to request unexisting route */
app.use((req, res, next) => {
    const err = new Error(`Odpytywany adres (${config.server.hostname}:${config.server.port}${req.url}) nie istnieje.`);
    
    return res.status(404).json({type: "string", err: err.message});
});

/** start the server with proper configuration */
https.createServer(config.server.options, app).listen(config.server.port, () => 
    logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`)
);