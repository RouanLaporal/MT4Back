import { Request, Response, NextFunction } from "express";
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');


export const authorization = (userTypes: 'student' | 'admin') => {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (request.headers.authorization) {

            } else {
                throw new Error("Not authorized")
            }
            next()
        } catch (err) {
            next(err)
        }
    }
}

export const signup = () => {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            request.body.password = bcrypt.hashSync(request.body.password, 10);
            // console.log(jwt.sign({ foo: 'bar' }, 'shhhhh'));

            next();
        } catch (err) {
            next(err)
        }
    }
}