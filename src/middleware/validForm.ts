import { Request, Response, NextFunction, request } from 'express';
import { ApiError } from '../classes/Errors/ApiError';

export const validationEmail = () => {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            const email = request.body.email;
            const emailRegex = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/;
            
            if(!email) {
                throw new ApiError(403, "validation/invalid-email", "No email provided");
            }
            
            if(emailRegex.test(email)){
                next();
            } else {
                throw new ApiError(403, "auth/invalid-email-format", "Invalid email")
            }
        } catch (err) {
            next(err)
        }
    }
}

export const validationPassword = () => {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            const password = request.body.password;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if(!password) {
                throw new ApiError(403,"validation/invalid-password", "No password provided");
            }
            if(passwordRegex.test(password)){ 
                next();
            } else {
                throw new ApiError(403, "auth/invalid-password-format", "Invalid password");
            }
        } catch (err) {
            next(err)
        }
    }
}