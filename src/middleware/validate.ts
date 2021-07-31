// libs
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import logging from "../configuration/logging";

const NAMESPACE = "validate middleware"

const validate = (req: Request, res: Response, next: NextFunction) => {
    // invoke validation with "express-validator" library
    const errs = validationResult(req);
    // check if errors occured
    if (!errs.isEmpty()) {
        // log in console
        logging.error(NAMESPACE, "Errors occured: ", errs.array());
        // return error response
        return res.status(400).json(errs.array());
    }
    else {
        // go next
        return next();
    }
}

export default validate;