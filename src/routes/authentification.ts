import { NextFunction, Request, Response, Router } from 'express';
import { CrudOperations, CrudRouter } from '../classes/CrudRouter';
import { IUserCreate, IUserRO, IUserUpdate } from '../types/tables/user/IUser';
import { UserCreateValidator, UserUpdateValidator } from '../types/tables/user/user.validator';
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../classes/DB';
import { ICreateResponse } from '../types/api/ICreateResponse';
import { IIndexQuery, IIndexResponse } from '../types/api/IIndexQuery';
import { ApiError } from '../classes/Errors/ApiError';
import { authorization } from '../middleware/authorization';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateUniqueId = require('generate-unique-id');
const fs = require('fs');
require("dotenv").config();
const router = Router({ mergeParams: true });

router.post<{}, {}, IUserCreate>('/',
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
                id: data[0].insertId
            });

        } catch (err: any) {
            next(err);
        }

    }
);

router.post('/verification-code', async (request: Request, response: Response, next: NextFunction) => {
    try {
    } catch (error) {
        next(error);
    }
})

router.post<{}, string, {}>('/login',
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            const db = DB.Connection
            const email: string = request.body.email
            const password: string = request.body.password
            const data = await db.query<IUserRO[] & RowDataPacket[]>("select password from user where email = ?", email);
            var privateKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_prof.key');
            var token = jwt.sign({ foo: 'bar' }, privateKey, { algorithm: 'RS256' })
            if (!data[0][0]) {
                next(new ApiError(403, 'auth/invalid-credentials', 'User not found'))
            }
            bcrypt.compare(password, data[0][0].password).then((res: boolean) => {
                if (res === false)
                    next(new ApiError(403, 'auth/invalid-credentials', 'Invalid email or password'))
                else
                    response.status(200).json({
                        token: token //avec clé privée
                    })
            })
        } catch (err) {
            next(err)
        }
    }
)

router.post('/reset-password', async (request: Request, response: Response, next: NextFunction) => {
    try {
        const db = DB.Connection
        const email: string = request.body.email
        const data = await db.query<IUserRO[] & RowDataPacket[]>("select * from user where email = ?", email);
        //TODO: send a code to reset password
    } catch (err) {
        next(err);
    }
})

router.post('/change-password', async (request: Request, response: Response, next: NextFunction) => {
    try {
        const db = DB.Connection
        const email: string = request.body.email
        const data = await db.query<IUserRO[] & RowDataPacket[]>("select password from user where email = ?", email);
        //TODO: compare old password, then change password in db if their match
    } catch (err) {
        next(err);
    }
})




export const ROUTES_AUTH = router;