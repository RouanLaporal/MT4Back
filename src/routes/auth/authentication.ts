import { Request, Response } from 'express';
import { ApiError } from '../../classes/Errors/ApiError';
import { ErrorCode } from '../../classes/Errors/ErrorCode';
const fs = require('fs');
const jwt = require('jsonwebtoken');


export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes: string[],
): Promise<any> {

  if (securityName === 'jwt') {
    if (!request.headers.authorization) {
      throw new ApiError(ErrorCode.Unauthorized, 'auth/missing-header', 'Missing authorization header');
    } else {
      try {
        const token = request.headers.authorization.split(' ')[1];
        var publicKey;
        for (let scope of scopes) {
          if (scope == 'professor') {
            publicKey = fs.readFileSync('src/routes/auth/key/jwtRS256_prof.key.pub', 'utf8');
          } else if (scope == 'student') {
            publicKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_student.key.pub', 'utf8');
          }
        }
        const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        return Promise.resolve(decodedToken);

      } catch (err) {
        throw err
      }
    }

  }

  return true;
}
