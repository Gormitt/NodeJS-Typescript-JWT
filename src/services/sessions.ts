// libs
import db from "../database/db";
import logging from "../configuration/logging";
import bcrypt from "bcrypt";
import fs from "fs";
import jwt from "jsonwebtoken";
// types
import { LoginData, User, SR, TokenPayload } from "../types";

const NAMESPACE = "Sessions services";

/**
 * function searches for user in database by login data
 */
export const findUser = async (data: LoginData): Promise<SR<User>> => {
    try {
        const { rows } = await db.query(`
            select 
                id, email, password
            from users
            where email = $1
        `, [data.email]);

        if (rows.length === 0) {
            return {
                success: false,
                type: "string",
                message: "Niepoprawny e-mail lub hasło."
            };
        }
        else {
            return {
                success: true,
                response: {
                    id: rows[0].id,
                    email: rows[0].email,
                    passwordHash: rows[0].password,
                    roles: []
                }
            };
        }
    }
    catch (err) {
        logging.error(NAMESPACE, `DB error [${err.code}]: ${err.message}`);
        return {
            success: false,
            type: "string",
            message: `Błąd bazy danych [${err.code}]: ${err.message}`
        };
    }
}

/**
 * function creates user in database (password hashed by bcrypt)
 */
export const createUser = async (email: string, password: string): Promise<void> => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    try {
        const { rows } = await db.query(`
            insert into users (email, password) values ($1, $2) returning *
        `, [email, hash]);

        logging.info(NAMESPACE, "User has been created.", rows[0]);

    } catch (err) {
        logging.error(NAMESPACE, `[${err.code}] ${err.message}`);
    }
}


/** 
 * function check if incoming user has the same password as user in database and generates token payload as outcome 
 */
export const generateTokenPayload = async (loginData: LoginData, storedUser: User): Promise<SR<TokenPayload>> => {
    try {
        const match = await bcrypt.compare(loginData.password, storedUser.passwordHash);

        if (match) {        
            return {
                success: true,
                response: {
                    id: storedUser.id,
                    email: storedUser.email,
                    roles: storedUser.roles
                }
            };
        }
        else {
            return {
                success: false,
                type: "string",
                message: "Niepoprawny e-mail lub hasło."
            };
        }
    } catch (err) {
        return {
            success: false,
            type: "string",
            message: "Błąd podczas działania porównywania hasła z hashem."
        }
    }
}

/**
 * function generates access token
 */
export const generateToken = (payload: TokenPayload): SR<string> => {
    try {
        const privateKey = fs.readFileSync("./authorization/private.key");
        const token = jwt.sign(payload, privateKey, {expiresIn: "1h"});

        return {
            success: true,
            response: token
        };
    } catch (err) {
        return {
            success: false,
            type: "string",
            message: "Błąd podczas otwierania klucza prywatnego podpisującego autoryzację."
        };
    }
}