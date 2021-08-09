// libs
import db from "../database/db";
import logging from "../configuration/logging";
// types
import { SR, Teacher } from "../types";

const NAMESPACE = "Teachers service";

/**
 * function finds and returns
 * - array of teachers (when no id is specified)
 * - one teacher (when id is given)
 */
export const getTeachers = async (userId: number, id: number | undefined): Promise<SR<Teacher[]>> => {
    try {
        const { rows } = await db.query(`
            select
                id, name, surname, color
            from teachers
            where user_id = ${userId} ${id ? `and id = ${id}` : ``}
        `);

        return {
            success: true,
            response: rows
        }
    } catch (err) {
        logging.error(NAMESPACE, `DB error [${err.code}]: ${err.message}`);

        return {
            success: false,
            type: "string",
            message: `Błąd bazy danych [${err.code}]: ${err.message}`
        }
    }
}