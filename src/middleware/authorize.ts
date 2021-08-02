// libs
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import fs from "fs";

const authorize = (req: Request, res: Response, next: NextFunction) => {
    let authHeader;
    let token;
    let privateKey;

    try {
        authHeader = req.header("authorization");
        if (!authHeader)
            return res.status(401).json({type: "string", err: "Nie znaleziono nagłówka autoryzacyjnego."});
        
        token = authHeader.split(" ")[1];
        if (!token)
            return res.status(401).json({type: "string", err: "W nagłówku autoryzacyjnym nie znaleziono tokenu."});

        privateKey = fs.readFileSync("./authorization/private.key");
    }
    catch (err) {
        return res.status(500).json({type: "string", err: "Błąd podczas otwierania klucza publicznego dekodującego token."});
    }

    try {
        req.body.middleware_user = jwt.verify(token, privateKey);

        next();
    }
    catch(err) {
        return res.status(401).json({type: "string", err: "Token jest nieważny."});
    }
}

export default authorize;