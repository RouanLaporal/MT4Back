import { NextFunction, request, Request, Response, Router } from 'express';
import { CrudOperations, CrudRouter } from '../../classes/CrudRouter';
import { IUserCreate, IUserRO, IUserUpdate } from '../../types/tables/user/IUser';
import { UserCreateValidator, UserUpdateValidator } from '../../types/tables/user/user.validator';
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../../classes/DB';
import { ICreateResponse } from '../../types/api/ICreateResponse';
import { IIndexQuery, IIndexResponse } from '../../types/api/IIndexQuery';
import { ApiError } from '../../classes/Errors/ApiError';
import { validationEmail, validationPassword } from '../../middleware/validForm';
import { authorization } from '../../middleware/authorization';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateUniqueId = require('generate-unique-id');
const fs = require('fs');
require("dotenv").config();
const routerIndex = Router({ mergeParams: true });
const routerSimple = Router({ mergeParams: true });

export const route_RUD = CrudRouter<IUserRO, IUserCreate, IUserUpdate>({
  table: 'user',
  primaryKey: 'user_id',
  operations: CrudOperations.Index | CrudOperations.Read | CrudOperations.Update | CrudOperations.Delete,
  readColumns: ['user_id', 'first_name', 'last_name', 'email', 'role_id', 'avatar', 'password'],
  validators: {
    create: UserCreateValidator,
    update: UserUpdateValidator
  }
});

routerIndex.post<{}, {}, IUserCreate>('/', 
  validationEmail(),
  validationPassword(),
  async (request, response, next: NextFunction) => {

    try {
      let user = request.body;
      user.password = bcrypt.hashSync(user.password, 10);
      const db = DB.Connection;
      user = { ...user, role_id: 1 }
      const data = await db.query<OkPacket>("insert into user set ?", user);
      const privateKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_prof.key', 'utf8');
      const unique_code = generateUniqueId({
        length: 5,
        useLetters: false
      });

      const validation = {
        code: unique_code,
        user_id: data[0].insertId
      }
      await db.query<OkPacket>("insert into validation set ?", validation);

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
                  "Name": user.first_name
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
      response.header('Authorization', jwt.sign({ user_id: data[0].insertId, }, privateKey, { algorithm: 'RS256' }));
      response.redirect('http://localhost:5050/auth/user/verification-code/' + data[0].insertId)
      next();

    } catch (err: any) {
      next(err);
    }

  }
);

routerSimple.post('/verification-code/:id', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const code = request.body

    const db = DB.Connection;
    const data = await db.query<RowDataPacket[]>("select code from validation where user_id = ?", id);

    if (Number(data[0][0].code) !== Number(code.code)) {
      return next(new ApiError(403, 'validation/invalid-code', 'Invalid code'))
    }

    await db.query<OkPacket>("update user set is_valid = true where user_id = ?", id);
    await db.query<OkPacket>("delete from validation where user_id = ?", id);

    response.json(true)
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
      var privateKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_prof.key', 'utf8');

      if (!data[0][0]) {
        next(new ApiError(403, 'auth/invalid-credentials', 'User not found'))
      }
      bcrypt.compare(password, data[0][0].password).then((res: boolean) => {
        if (res === false)
          next(new ApiError(403, 'auth/invalid-credentials', 'Invalid email or password'))
        else
          response.status(200).json({
            token: jwt.sign({
              user_id: data[0][0].user_id,
              first_name: data[0][0].first_name,
              last_name: data[0][0].last_name,
              avatar: null,
              email: data[0][0].email,
            }, privateKey, { algorithm: 'RS256' })
          })
      })
    } catch (err) {
      next(err)
    }
  }
)

routerSimple.post('/forget-password', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const db = DB.Connection;
    const email: string = request.body.email;
    const data = await db.query<IUserRO[] & RowDataPacket[]>("select * from user where email = ?", email);

    if (!data[0][0]) {
      next(new ApiError(403, 'auth/invalid-credentials', 'User not found'));
    } else {
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
                  "Email": email,
                  "Name": data[0][0].first_name
                }
              ],
              "Subject": "Reset Password",
              "TextPart": `http://localhost:5050/auth/user/reset-password/${data[0][0].user_id}`,
              "CustomID": "CodeVerification"
            }
          ]
        })

      response.json(
        "Success"
      );
    }

  } catch (err) {
    next(err);
  }
})

routerSimple.post('/reset-password/:id', validationPassword(), async (request: Request, response: Response, next: NextFunction) => {
  try {
    const db = DB.Connection;
    const { id } = request.params;
    var password: string = request.body.password;

    password = bcrypt.hashSync(password, 10);
    db.query<OkPacket>("update user set password=? where user_id=?", [password, id]);
    response.json(
      "Success"
    )
  } catch (err) {
    next(err);
  }
})

routerSimple.post('/change-password', validationPassword(), async (request: Request, response: Response, next: NextFunction) => {
  try {
    const db = DB.Connection
    const email: string = request.body.email
    const oldPassword: string = request.body.oldPassword
    var newPassword: string = request.body.password
    const data = await db.query<IUserRO[] & RowDataPacket[]>("select * from user where email = ?", email);

    if (!data[0][0]) {
      next(new ApiError(403, 'auth/invalid-credentials', 'User not found'))
    }
    bcrypt.compare(oldPassword, data[0][0].password).then((res: boolean) => {
      if (res === false) {
        next(new ApiError(403, 'auth/invalid-credentials', 'Invalid email or password'))
      } else {
        newPassword = bcrypt.hashSync(newPassword, 10)
        db.query<OkPacket>('update user set password = ? where email = ?', [newPassword, email])
        response.status(200).json(
          true
        )
      }
    })
  } catch (err) {
    next(err);
  }
})

const route_user = Router({ mergeParams: true })
route_user.use(route_RUD);
route_user.use(routerIndex);
route_user.use(routerSimple);

export const ROUTES_USER = route_user;