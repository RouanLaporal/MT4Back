import { CrudOperations, CrudRouter } from '../classes/CrudRouter';
import { IChallengeCreate, IChallengeRO, IChallengeUpdate } from '../types/tables/challenge/IChallenge';
import { ChallengeCreateValidator, ChallengeUpdateValidator } from '../types/tables/challenge/challenge.validator';
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../classes/DB';
import { NextFunction, request, Request, Response, Router } from 'express';
import { authorization } from '../middleware/authorization';
import { SGBDRInstance } from '../classes/SGBDRInstance';
import router from '../../front/front-challenge/src/router';
import { ApiError } from '../classes/Errors/ApiError';

const routerIndex = Router({ mergeParams: true });
const routerSimple = Router({ mergeParams: true });
const jwt = require('jsonwebtoken');
const fs = require('fs');




export const ROUTES_RUD = CrudRouter<IChallengeRO, IChallengeCreate, IChallengeUpdate>({
  table: 'CHALLENGE',
  primaryKey: 'challenge_id',
  operations: CrudOperations.Update | CrudOperations.Delete,
  readColumns: ['challenge_id', 'challenge', 'is_active'],
  validators: {
    create: ChallengeCreateValidator,
    update: ChallengeUpdateValidator
  }
});

routerIndex.get('/', authorization('professor'),
  async (request: Request, response: Response, next: NextFunction) => {
    const db = DB.Connection;
    const { user_id } = response.locals
    const data = await db.query<RowDataPacket[]>("select * from CHALLENGE where user_id = ?", user_id);
  })



routerIndex.post<{}, {}>('/', authorization('professor'),
  async (request: Request, response: Response, next: NextFunction) => {
    try {


      const challenge = {
        challenge: request.body.challenge,
        is_active: request.body.is_active,
      }


      // insert new user in table 
      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into CHALLENGE set ?", challenge);
      var privateKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_prof.key', 'utf8');


      response.status(200).json({
        url: `http://localhost:5050/challenge/evaluation/${jwt.sign({
          challenge_id: data[0].insertId,
          promo_id: request.body.promo_id
        }, privateKey, { algorithm: 'RS256' })}`,
        challenge: request.body.challenge,
      })
    } catch (error) {
      next(error);
    }
  }
)

routerSimple.post('/evaluation/authentification/:token',
  async (request, response, next: NextFunction) => {
    const { token } = request.params;
    const publicKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_prof.key.pub', 'utf8');
    const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    const db = DB.Connection;
    const data = await db.query<IChallengeRO[] & RowDataPacket[]>("select * from CHALLENGE where challenge_id = ?", decodedToken.challenge_id)

    if (data[0][0].is_active == false) {
      next(new ApiError(403, 'challenge/not-active', "Can't access this challenge"));
    } else {
      let email = request.body;
      email = { ...email, role_id: 2, is_valid: true }





      const data_user = await db.query<OkPacket>("insert into USER set ?", email);
      let participation = {
        challenge_id: decodedToken.challenge_id,
        user_id: data_user[0].insertId,
        promo_id: decodedToken.promo_id,
        score: 0,
      }
      const privateKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_student.key', 'utf8');
      const new_token = jwt.sign({
        user_id: data_user[0].insertId,
      }, privateKey, { algorithm: 'RS256' })
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
                  "Email": email
                }
              ],
              "Subject": "Lancez votre challenge",
              "TextPart": `http://localhost:5050/challenge/evaluation/SGBDR`,
              "CustomID": "Challenge"
            }
          ]
        })
      await db.query<OkPacket>("insert into PARTICIPATON set ?", participation);

      response.status(200).json({
        token: jwt.sign({
          user_id: data_user[0].insertId,
        }, privateKey, { algorithm: 'RS256' })
      })
    }
  }
)

routerSimple.post('/desactivation', authorization('professor'),
  async (request: Request, response: Response, next: NextFunction) => {
    const { challenge_id } = request.body;
    const db = DB.Connection;
    const data = await db.query<OkPacket>("update CHALLENGE set is_active = 0  where challenge_id =  ?", challenge_id);
    return {
      rows: data[0].affectedRows
    }
  }
)

routerSimple.post('/evaluation/SGBDR', authorization('student'),
  async (request: Request, response, next: NextFunction) => {
    const db = DB.Connection;
    const { user_id } = response.locals;
    const user = {
      last_name: request.body.last_name,
      first_name: request.body.first_name,
    }

    const data = await db.query<OkPacket>("update USER set first_name = ?,  last_name = ? where user_id = ?", [user.first_name, user.last_name, user_id]);
    let instance = {
      address_ip: request.body.address_ip,
      user_name: request.body.user_name,
      db_password: request.body.db_password,
      db_port: request.body.db_port
    }
    let connection = new SGBDRInstance(instance.address_ip, instance.user_name, instance.db_password, instance.db_port);
    try {
      await connection.handle("use challenge_SGBDR", "The challenge_SGBDR database does not exist", response, user_id);
      await connection.handle("describe table USER", "The challenge_SGBDR database does not exist", response, user_id);

    } catch (error) {
      next(error);
    }
  })


const route_challenge = Router({ mergeParams: true })
route_challenge.use(ROUTES_RUD);
route_challenge.use(routerIndex);
route_challenge.use(routerSimple);

export const ROUTES_CHALLENGE = route_challenge;
