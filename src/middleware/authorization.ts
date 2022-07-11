import { Request, Response, NextFunction } from "express";
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const fs = require('fs');

//TODO: passer le role à la fonction 
export const authorization = async (request: Request, response: Response, next: NextFunction) => {
    try {
        if (request.headers.authorization) {
            const token = request.headers.authorization.split(' ')[1];
            const publicKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_prof.key.pub', 'utf8');
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

