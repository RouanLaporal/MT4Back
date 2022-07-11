import { Request, Response, NextFunction } from "express";
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const fs = require('fs');


export const authorization = (userTypes: 'professor' | 'student' | 'admin') => {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (request.headers.authorization) {
                const token = request.headers.authorization.split(' ')[1];
                var publicKey;
                if(userTypes == 'professor') {
                    publicKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_prof.key.pub', 'utf8');
                } else if(userTypes == 'student') {
                    publicKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_student.key.pub', 'utf8');
                } else {
                    publicKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_admin.key.pub', 'utf8');
                }
                const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
                response.locals = decodedToken;
            } else {
                throw new Error("Not authorized")
            }
            next();
        } catch (err) {
            next(err)
        }
}
}


