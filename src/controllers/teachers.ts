// libs
import { Request, Response, NextFunction } from "express";
import logging from "../configuration/logging";
// services
import { getTeachers } from "../services/teachers";
// types
import { SR, Teacher } from "../types";

const NAMESPACE = "Teachers controller";

/**
 * GET teachers
 */
const teachers = async (req: Request, res: Response, next: NextFunction) => {

    // put parsed id value or undefined into variable
    const id = isNaN(parseInt(req.params.id)) ? undefined : parseInt(req.params.id);
    // invoke service
    const getTeachersSR: SR<Teacher[]> = await getTeachers(req.body.middleware_user.id, id);

    if (!getTeachersSR.success)
        return res.status(400).json({type: getTeachersSR.type, err: getTeachersSR.message});

    res.status(200).json(getTeachersSR.response);
}

export default {
    teachers
}