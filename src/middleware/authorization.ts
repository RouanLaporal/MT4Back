import { Request, Response, NextFunction } from "express";
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const fs = require('fs');


export const authorization = (userTypes: 'student' | 'professor' | 'admin') => {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (request.headers.authorization) {
                try {
                    const token = request.headers.authorization.split(' ')[1];
                    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
                    const userId = decodedToken.userId;
                    next();
                } catch {
                    response.status(401).json({
                        error: new Error('Invalid request!')
                    });
                }
            } else {
                throw new Error("Not authorized")
            }
            next()
        } catch (err) {
            next(err)
        }
    }
}
