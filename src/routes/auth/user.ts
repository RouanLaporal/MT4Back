import { NextFunction, Router } from "express";
import { Crud } from '../../classes/Crud';
import { ICreateResponse } from '../../types/api/ICreateResponse';
import { IIndexQuery, IIndexResponse } from '../../types/api/IIndexQuery';
import { IUserCreate, IUserRO, IUserUpdate } from '../../types/tables/user/IUser';
import { UserCreateValidator, UserUpdateValidator } from '../../types/tables/user/user.validator';
import { IUpdateResponse } from '../../types/api/IUpdateResponse';

const READ_COLUMNS = ['userId', 'familyName', 'givenName', 'email'];

const routerIndex = Router({ mergeParams: true });

// Index: GET /
routerIndex.get<{}, IIndexResponse<IUserRO>, {}, IIndexQuery>('/',
  async (request, response, next: NextFunction) => {

    try {      
      
      const result = await Crud.Index<IUserRO>(request.query, 'user', READ_COLUMNS);      
      response.json(result);

    } catch (err: any) {
      next(err);
    }

  }
);

// Create: POST /
routerIndex.post<{}, ICreateResponse, IUserCreate>('/',
  async (request, response, next: NextFunction) => {

    try {
      const result = await Crud.Create<IUserCreate>(request.body, 'user', UserCreateValidator);
      response.json(result);

    } catch (err: any) {
      next(err);
    }

  }
);

const routerSimple = Router({ mergeParams: true });

interface ISimpleParams {
  userId: string;
}

// Read: Get /:userId
routerSimple.get<ISimpleParams, IUserRO, {}, {}>('/',
  async (request, response, next: NextFunction) => {

    try {            
      const result = await Crud.Read<IUserRO>('user', 'userId', parseInt(request.params.userId), READ_COLUMNS);
      response.json(result);

    } catch (err: any) {
      next(err);
    }

  }
);



// Update: PUT /:userId
routerSimple.put<ISimpleParams, IUpdateResponse, IUserUpdate, {}>('/',
  async (request, response, next: NextFunction) => {

    try {            
      const result = await Crud.Update(request.body, 'user', 'userId', parseInt(request.params.userId), UserUpdateValidator);
      response.json(result);

    } catch (err: any) {
      next(err);
    }

  }
);


// Delete: DELETE /:userId
routerSimple.delete<ISimpleParams, IUpdateResponse, {}, {}>('/',
  async (request, response, next: NextFunction) => {

    try {            
      const result = await Crud.Delete('user', 'userId', parseInt(request.params.userId));
      response.json(result);

    } catch (err: any) {
      next(err);
    }

  }
);



// Regroupé
const routerUser = Router({ mergeParams: true });
routerUser.use(routerIndex);
routerUser.use('/:userId', routerSimple);

export const ROUTES_USER = routerUser;