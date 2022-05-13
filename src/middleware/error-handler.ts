import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../classes/Errors/ApiError';
import { ErrorCode } from '../classes/Errors/ErrorCode';

export const DefaultErrorHandler = async (error: any, req: Request, res: Response, next: NextFunction) => {

  console.log(error);
  console.log(error.constructor.name);

  let err = new ApiError(ErrorCode.InternalError, 'internal/unknown', 'An unknown internal error occurred');
    
  if (!!error) {
    if (error instanceof ApiError) {
      err = error;
    } 
    else if (!!error.sql) {
      // Ceci est une erreur envoyé par la base de données. On va supposer une erreur de la part de l'utilisateur
      // A faire : il est peut-être recommandé d'avoir un handler dédié aux erreurs SQL pour mieux trier celles qui sont de notre faute, et celles la faute de l'utilisateur.
      err = new ApiError(ErrorCode.BadRequest, 'sql/failed', error.message, {
        sqlState: error.sqlState,
        sqlCode: error.code
      });      
      // A noter : on ne renvoie pas le SQL pour ne pas divulger les informations secrets
    } else {
      if (error.message) {
        err.message = error.message;
      }
    }
  }
  console.log(err.json);

  res.status(err.code).json(err.json);   
  
}
