// libs
import { Request, Response, NextFunction } from "express";
import logging from "../configuration/logging";
// services
import { findUser, generateTokenPayload, generateToken, createUser } from "../services/sessions";
// types
import { LoginData, User, SR, TokenPayload } from "../types";

const NAMESPACE = "Sessions controller";

/** 
 * login route
 */
const login = async (req: Request, res: Response, next: NextFunction) => {

    const incomingUser: LoginData = req.body;
    const findUserSR: SR<User> = await findUser(incomingUser);

    if (!findUserSR.success) 
        return res.status(401).json(findUserSR.message);
    

    const storedUser: User = findUserSR.response;
    const genTokenPayloadSR: SR<TokenPayload> = await generateTokenPayload(incomingUser, storedUser);

    if (!genTokenPayloadSR.success) 
        return res.status(401).json(genTokenPayloadSR.message);
    
    const genTokenSr: SR<string> = generateToken(genTokenPayloadSR.response);

    if (!genTokenSr.success) 
        return res.status(500).json(genTokenSr.message);

    res.status(200).json(genTokenSr.response);
}

/** 
 * route for checking if token is valid
 */
const checkToken = async (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "Body of request", req.body);

    res.status(200).json("Token jest ważny");
}

export default {
    login,
    checkToken
}