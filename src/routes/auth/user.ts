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
const generateUniqueId = require('generate-unique-id');
require("dotenv").config();
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

routerIndex.post<{}, {}, IUserCreate>('/',
  async (request, response, next: NextFunction) => {

    try {
      const user = request.body;

      user.password = bcrypt.hashSync(user.password, 10);
      const unique_code = generateUniqueId({
        length: 5,
        useLetters: false
      });
      const mailjet = require('node-mailjet')
        .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
      const mj_request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
          "Messages": [
            {
              "From": {
                "Email": "rouan.laporal@outlook.com",
                "Name": "Rouan"
              },
              "To": [
                {
                  "Email": user.email,
                  "Name": user.firstName
                }
              ],
              "Subject": "Verification Code",
              "TextPart": unique_code,
              "CustomID": "CodeVerification"
            }
          ]
        })
      mj_request
        .then((result: any) => {
          console.log(result.body)
        })
        .catch((err: any) => {
          console.log(err.statusCode)
        })
      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into user set ?", user);

      response.json({
        id: data[0].insertId,
        unique_code: unique_code
      });

    } catch (err: any) {
      next(err);
    }

  }
);

routerSimple.post('/verification-code', async (request: Request, response: Response, next: NextFunction) => {
  try {
  } catch (error) {
    next(error);
  }
})

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

routerSimple.post('/reset-password', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const db = DB.Connection
    const email: string = request.body.email
    const data = await db.query<IUserRO[] & RowDataPacket[]>("select * from user where email = ?", email);
    //TODO: send a code to reset password
  } catch (err) {
    next(err);
  }
})

routerSimple.post('/change-password', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const db = DB.Connection
    const email: string = request.body.email
    const data = await db.query<IUserRO[] & RowDataPacket[]>("select password from user where email = ?", email);
    //TODO: compare old password, then change password in db if their match
  } catch (err) {
    next(err);
  }
})
const route_user = Router({ mergeParams: true })
route_user.use(route_RUD);
route_user.use(routerIndex);
route_user.use(routerSimple);

export const ROUTES_USER = route_user;