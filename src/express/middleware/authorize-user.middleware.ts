import { NextFunction, Request, Response } from "express";


// On peut envelopper notre middleware dans une fonction, qui permet de configurer précisement le comportement selon
// le context dans lequel il se trouve
export const authorizeUser = (params?: any) => {

  return async (request: Request, response: Response, next: NextFunction) => {
    try {
     
      // Faire de l'autorisation sur l'action
  
      // Si tout va bien, on appelle next() pour passer à l'étape 2
      next();
  
    } catch (err: any) {
      next(err);
    }
  }

}


