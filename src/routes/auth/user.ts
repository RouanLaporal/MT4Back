// import { NextFunction, request, Request, Response, Router } from 'express';
// import { CrudOperations, CrudRouter } from '../../classes/CrudRouter';
// import { IUserCreate, IUserRO, IUserUpdate } from '../../types/tables/user/IUser';
// import { UserCreateValidator, UserUpdateValidator } from '../../types/tables/user/user.validator';
// import { OkPacket, RowDataPacket } from 'mysql2';
// import { DB } from '../../classes/DB';
// import { ICreateResponse } from '../../types/api/ICreateResponse';
// import { IIndexQuery, IIndexResponse } from '../../types/api/IIndexQuery';
// import { ApiError } from '../../classes/Errors/ApiError';
// import { validationEmail, validationPassword } from '../../middleware/validForm';
// import { authorization } from '../../middleware/authorization';
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const generateUniqueId = require('generate-unique-id');
// const fs = require('fs');
// require("dotenv").config();
// export const routerIndex = Router({ mergeParams: true });
// const routerSimple = Router({ mergeParams: true });

// export const route_RUD = CrudRouter<IUserRO, IUserCreate, IUserUpdate>({
//   table: 'USERS',
//   primaryKey: 'user_id',
//   operations: CrudOperations.Index | CrudOperations.Read | CrudOperations.Update | CrudOperations.Delete,
//   readColumns: ['user_id', 'first_name', 'last_name', 'email', 'role_id', 'avatar', 'password', 'is_valid'],
//   validators: {
//     create: UserCreateValidator,
//     update: UserUpdateValidator
//   }
// });



// routerSimple.post('/change-password', validationPassword(), async (request: Request, response: Response, next: NextFunction) => {
//   try {
//     const db = DB.Connection
//     const email: string = request.body.email
//     const oldPassword: string = request.body.oldPassword
//     var newPassword: string = request.body.password
//     const data = await db.query<IUserRO[] & RowDataPacket[]>("select * from USERS where email = ?", email);

//     if (!data[0][0]) {
//       next(new ApiError(403, 'auth/invalid-credentials', 'User not found'))
//     }
//     bcrypt.compare(oldPassword, data[0][0].password).then((res: boolean) => {
//       if (res === false) {
//         next(new ApiError(403, 'auth/invalid-credentials', 'Invalid email or password'))
//       } else {
//         newPassword = bcrypt.hashSync(newPassword, 10)
//         db.query<OkPacket>('update USERS set password = ? where email = ?', [newPassword, email])
//         response.status(200).json(
//           true
//         )
//       }
//     })
//   } catch (err) {
//     next(err);
//   }
// })

// const route_user = Router({ mergeParams: true })
// route_user.use(route_RUD);
// route_user.use(routerIndex);
// route_user.use(routerSimple);

// export const ROUTES_USER = route_user;