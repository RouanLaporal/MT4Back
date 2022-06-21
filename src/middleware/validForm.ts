import { Request, Response, NextFunction, request } from 'express';

export const validationEmail = () => {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            console.log("In try")
            const email = request.body.email;
            const emailRegex = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/;
            
            if(!email) {
                throw new Error("No email provided");
            }
            
            if(emailRegex.test(email)){
                next();
            } else {
                throw new Error("Invalid email")
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
            const passwordRegex = /^(?=.{10,}$)(?=.[a-z])(?=.[A-Z])(?=.[0-9])(?=.\W).*$/g;

            if(!password) {
                throw new Error("No password provided");
            }

            if(passwordRegex.test(password)){
                next();
            } else {
                throw new Error("Invalid password")
            }
        } catch (err) {
            next(err)
        }
    }
}