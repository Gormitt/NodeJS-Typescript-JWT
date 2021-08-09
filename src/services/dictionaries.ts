// libs
import db from "../database/db";
import logging from "../configuration/logging";
// types
import { SR, Class } from "../types";

const NAMESPACE = "Teachers service";

/**
 * function finds and returns all classes
 */
 export const getClasses = async (): Promise<SR<Class[]>> => {
    try {
        const { rows } = await db.query(`
            select
                id, name
            from classes
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