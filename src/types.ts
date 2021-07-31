/** authentication */
export type LoginData = {
    email: string,
    password: string
}

/** user data */
export type User = {
    id: number,
    email: string,
    passwordHash: string,
    roles: Array<string>
}

/** token content */
export type TokenPayload = {
    id: number,
    email: string,
    roles: Array<string>
}

interface PositiveSR<T>  {
    success: true;
    response: T;
}

interface NegativeSR {
    success: false;
    message: string;
}

/** 
 * service handler
 * - when success is true  - it takes form of PositiveSR
 * - when success is false - it takes form of NegativeSR
 */
export type SR<T> = PositiveSR<T> | NegativeSR;
