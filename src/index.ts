// server library
import express from "express";
import https from "https";
import bodyParser from "body-parser";
// logging system and configuration
import logging from "./configuration/logging";
import config from "./configuration/config";

const NAMESPACE = "Server";
const app = express();

/** Loggin the request into the console */
app.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

    res.on("finish", () => {
        logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
    });

    next();
});

/** Parse the request (allow to send nested JSON, avoid nececity of parsing JSON in frontend) */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** Rules of api (what methods are allowed, where request can come from, what kind of headers are allowed) */
app.use((req, res, next) => {
    // next line shouldn't be on production (predefine ip's on production!)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET POST PUT DELETE");
        return res.status(200).json({});
    }

    next();
});

/** Routes */


/** Unknown route handler - if we pass threw all routes to here, user wants to request unexisting route */
app.use((req, res, next) => {
    const err = new Error("Nie znaleziono adresu.");
    
    return res.status(404).json({message: err.message});
});

/** Start the server with proper configuration */
https.createServer(config.server.options, app).listen(config.server.port, () => 
    logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`)
);