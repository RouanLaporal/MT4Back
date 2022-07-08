import { NextFunction, Response, Request } from 'express';

export const TestMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  console.log("This is a test middleware.");
  next();
  
}
