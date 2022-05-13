import { NextFunction, Request, Response } from "express";

const loadUserStub = async (userId: string) => {
  // ex. "select userId from users where id = userId"
  return undefined;
}

/** Middleware pour autoriser le :userId */
export const identifyUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    // Les query PARAMS sont disponibles sur l'objet request
    const userId = request.params.userId;
    if (!userId /* || user not in database */) {
      throw new Error("UserId not found!");
    }

    // ICI, valider l'autorisation
    response.locals.user = await loadUserStub(userId);

    // Si tout va bien, on appelle next() pour passer à l'étape 2
    next();

  } catch (err: any) {
    next(err);
  }
}
