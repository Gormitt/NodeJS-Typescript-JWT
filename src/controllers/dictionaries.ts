// libs
import { Request, Response, NextFunction } from "express";
import logging from "../configuration/logging";
// services
import { getClasses } from "../services/dictionaries";
// types
import { SR, Class } from "../types";

const NAMESPACE = "Dictionaries controller";

const classes = async (req: Request, res: Response, next: NextFunction) => {

    const getClassesSR: SR<Class[]> = await getClasses();

    if (!getClassesSR.success)
        return res.status(400).json({type: getClassesSR.type, err: getClassesSR.message});

    res.status(200).json(getClassesSR.response);
}

export default {
    classes
}