import { NextFunction, Request, Response, Router } from 'express';
import { CrudOperations, CrudRouter } from '../../classes/CrudRouter';
import { IUserCreate, IUserRO, IUserUpdate } from '../../types/tables/user/IUser';
import { UserCreateValidator, UserUpdateValidator } from '../../types/tables/user/user.validator';
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../../classes/DB';
import { ICreateResponse } from '../../types/api/ICreateResponse';
import { IIndexQuery, IIndexResponse } from '../../types/api/IIndexQuery';
import { ApiError } from '../../classes/Errors/ApiError';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const routerIndex = Router({ mergeParams: true });
const routerSimple = Router({ mergeParams: true });

export const route_RUD = CrudRouter<IUserRO, IUserCreate, IUserUpdate>({
  table: 'user',
  primaryKey: 'userId',
  operations: CrudOperations.Index | CrudOperations.Read | CrudOperations.Update | CrudOperations.Delete,
  readColumns: ['userId', 'firstName', 'lastName', 'email', 'roleId', 'avatar', 'password'],
  validators: {
    create: UserCreateValidator,
    update: UserUpdateValidator
  }
});

routerIndex.post<{}, ICreateResponse, IUserCreate>('/',
  async (request, response, next: NextFunction) => {

    try {
      const user = request.body;

      user.password = bcrypt.hashSync(user.password, 10);

      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into user set ?", user);

      response.json({
        id: data[0].insertId
      });

    } catch (err: any) {
      next(err);
    }

  }
);

routerSimple.post<{}, string, {}>('/login',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const db = DB.Connection
      const email: string = request.body.email
      const password: string = request.body.password
      const data = await db.query<IUserRO[] & RowDataPacket[]>("select * from user where email = ?", email);
      if (!data[0][0]) {
        next(new ApiError(403, 'auth/invalid-credentials', 'User not found'))
      }
      bcrypt.compare(password, data[0][0].password).then((res: boolean) => {
        if (res === false)
          next(new ApiError(403, 'auth/invalid-credentials', 'Invalid email or password'))
        else
          response.status(200).json({
            firstName: data[0][0].firstName,
            lastName: data[0][0].lastName,
            avatar: data[0][0].avatar,
            email: data[0][0].email,
            roleId: data[0][0].roleId,
            token: jwt.sign({ foo: 'bar' }, 'shhhhh') //avec clé privée
          })
      })
    } catch (err) {
      next(err)
    }
  }
)

const route_user = Router({ mergeParams: true })
route_user.use(route_RUD);
route_user.use(routerIndex);
route_user.use(routerSimple);

export const ROUTES_USER = route_user;