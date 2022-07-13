import { NextFunction, request, Request, Response, Router } from 'express';
import { CrudOperations, CrudRouter } from './CrudRouter';
import { IUserCreate, IUserRO, IUserUpdate } from '../types/tables/user/IUser';
import { UserCreateValidator, UserUpdateValidator } from '../types/tables/user/user.validator';
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from './DB';
import { ICreateResponse } from '../types/api/ICreateResponse';
import { IIndexQuery, IIndexResponse } from '../types/api/IIndexQuery';
import { ApiError } from './Errors/ApiError';
import { validationEmail, validationPassword } from '../middleware/validForm';
import { authorization } from '../middleware/authorization';
import { IValidationCreate } from '../types/tables/validation/IValidation';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateUniqueId = require('generate-unique-id');
const fs = require('fs');
require("dotenv").config();
export class User {

    public async register(user: Omit<IUserCreate, 'role_id'>) {
        try {
            user.password = bcrypt.hashSync(user.password, 10);
            const insert_user = { ...user, role_id: 1, is_valid: false };
            // insert new user in table 
            const db = DB.Connection;
            const data = await db.query<OkPacket>("insert into USERS set ?", insert_user);

            // generate a unique code & insert in table 
            const unique_code = generateUniqueId({
                length: 5,
                useLetters: false
            });

            const validation = {
                code: unique_code,
                user_id: data[0].insertId
            }
            await db.query<OkPacket>("insert into VALIDATIONS set ?", validation);

            // send mail with code
            const mailjet = require('node-mailjet')
                .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
            const mj_request = mailjet
                .post("send", { 'version': 'v3.1' })
                .request({
                    "Messages": [
                        {
                            "From": {
                                "Email": "rouan.laporal@outlook.com",
                                "Name": "Challenge"
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

            // return token in response
            const privateKey = fs.readFileSync('src/routes/auth/key/jwtRS256_prof.key', 'utf8');
            return {
                token: jwt.sign({
                    user_id: data[0].insertId,
                }, privateKey, { algorithm: 'RS256' })
            }
        } catch (err: any) {
            throw (err);
        }
    }

    public async verificationCode(code: number, user_id: number) {
        try {
            const db = DB.Connection;
            const data = await db.query<RowDataPacket[]>("select code from VALIDATIONS where user_id = ?", user_id);
            // compare if code is good
            if (Number(data[0][0].code) !== Number(code)) {
                return new ApiError(403, 'validation/invalid-code', 'Invalid code');
            }

            // update is_valid as true & delete code to validation table
            await db.query<OkPacket>("update USERS set is_valid = true where user_id = ?", user_id);
            await db.query<OkPacket>("delete from VALIDATIONS where user_id = ?", user_id);

            // return true response
            return true;
        } catch (error) {
            throw error;
        }
    }

    public async forgetPassword(body: any) {
        try {
            const email = body.email;
            const db = DB.Connection;
            const data = await db.query<IUserRO[] & RowDataPacket[]>("select user_id from USERS where email = ?", email);
            if (!data[0][0]) {
                throw new ApiError(403, 'auth/invalid-credentials', 'User not found');
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
                                "TextPart": `http://localhost:8080/reset-password/${data[0][0].user_id}`,
                                "CustomID": "CodeVerification"
                            }
                        ]
                    })

                return {
                    "status": "Success"
                };
            }

        } catch (err) {
            throw err;
        }
    }

    public async resetPassword(body: any, id: number) {
        try {
            const db = DB.Connection;
            var password: string = body.password;

            password = bcrypt.hashSync(password, 10);
            db.query<OkPacket>("update USERS set password=? where user_id=?", [password, id]);
            return {
                "status": "Success"
            };
        } catch (err) {
            throw err;
        }
    }

    public async Login(body: any) {
        try {
            const db = DB.Connection
            const email: string = body.email
            const password: string = body.password
            const data = await db.query<IUserRO[] & RowDataPacket[]>("select * from USERS where email = ?", email);
            const privateKey = fs.readFileSync('src/routes/auth/key/jwtRS256_prof.key', 'utf8');
            if (!data[0][0]) {
                return new ApiError(403, 'auth/invalid-credentials', 'User not found')
            }
            const match = await bcrypt.compare(password, data[0][0].password);
            if (match)
                return {
                    token: jwt.sign({
                        user_id: data[0][0].user_id,
                        first_name: data[0][0].first_name,
                        last_name: data[0][0].last_name,
                        avatar: null,
                        email: data[0][0].email,
                    }, privateKey, { algorithm: 'RS256' })
                }
            else
                return new ApiError(403, 'auth/invalid-credentials', 'Invalid email or password')
        } catch (err) {
            throw err
        }
    }

    public async changePassword(body: any) {
        try {
            const db = DB.Connection
            const email: string = body.email
            const oldPassword: string = body.oldPassword
            var newPassword: string = body.newPassword
            const data = await db.query<IUserRO[] & RowDataPacket[]>("select password from USERS where email = ?", email);
            console.log(data[0])
            if (!data[0][0]) {
                return (new ApiError(403, 'auth/invalid-credentials', 'User not found'))
            }
            const match = await bcrypt.compare(oldPassword, data[0][0].password);
            if (match) {
                newPassword = bcrypt.hashSync(newPassword, 10)
                db.query<OkPacket>('update USERS set password = ? where email = ?', [newPassword, email])
                return true;
            }
            return (new ApiError(403, 'auth/invalid-credentials', 'Invalid email or password'))
        } catch (err) {
            throw err;
        }
    }
}


