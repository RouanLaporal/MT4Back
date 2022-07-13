import { Request, Response, NextFunction } from "express";
import { ApiError } from '../classes/Errors/ApiError';
import { ErrorCode } from '../classes/Errors/ErrorCode';

const jwt = require('jsonwebtoken');
const fs = require('fs');


export const authorization = (userTypes: 'professor' | 'student' | 'admin') => {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (request.headers.authorization) {
                const token = request.headers.authorization.split(' ')[1];
                var publicKey;
                if (userTypes == 'professor') {
                    switch (process.env.APP_ENV) {
                        case "local":
                            publicKey = fs.readFileSync(`${process.env.KEY_PATH_LOCAL}jwtRS256_prof.key.pub`, 'utf8');
                            break;
                        case "prod":
                            publicKey = fs.readFileSync(`${process.env.KEY_PATH_PROD}jwtRS256_prof.key.pub`, 'utf8');
                            break;
                    }

                } else if (userTypes == 'student') {
                    switch (process.env.APP_ENV) {
                        case "local":
                            publicKey = fs.readFileSync(`${process.env.KEY_PATH_LOCAL}jwtRS256_student.key.pub`, 'utf8');
                            break;
                        case "prod":
                            publicKey = fs.readFileSync(`${process.env.KEY_PATH_PROD}jwtRS256_student.key.pub`, 'utf8');
                            break;
                    }
                } else {
                    switch (process.env.APP_ENV) {
                        case "local":
                            publicKey = fs.readFileSync(`${process.env.KEY_PATH_LOCAL}jwtRS256_admin.key.pub`, 'utf8');
                            break;
                        case "prod":
                            publicKey = fs.readFileSync(`${process.env.KEY_PATH_PROD}jwtRS256_admin.key.pub`, 'utf8');
                            break;
                    }
                }
                const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
                response.locals = decodedToken;
                next();
            } else {
                next(new ApiError(ErrorCode.Unauthorized, 'auth/missing-header', 'Missing authorization header'));
            }
        } catch (err) {
            next(err)
        }
    }
}


