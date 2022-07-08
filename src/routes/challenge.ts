import { CrudOperations, CrudRouter } from '../classes/CrudRouter';
import { IChallengeCreate, IChallengeRO, IChallengeUpdate } from '../types/tables/challenge/IChallenge';
import { ChallengeCreateValidator, ChallengeUpdateValidator } from '../types/tables/challenge/challenge.validator';
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../classes/DB';
import { NextFunction, request, Request, Response, Router } from 'express';
import { authorization } from '../middleware/authorization';

const routerIndex = Router({ mergeParams: true });
const routerSimple = Router({ mergeParams: true });
const jwt = require('jsonwebtoken');
const fs = require('fs');




export const ROUTES_RUD = CrudRouter<IChallengeRO, IChallengeCreate, IChallengeUpdate>({
  table: 'challenge',
  primaryKey: 'challenge_id',
  operations: CrudOperations.Index | CrudOperations.Read | CrudOperations.Update | CrudOperations.Delete,
  readColumns: ['challenge_id', 'challenge', 'user_id'],
  validators: {
    create: ChallengeCreateValidator,
    update: ChallengeUpdateValidator
  }
});



routerIndex.post<{}, {}>('/', authorization,
  async (request, response, next: NextFunction) => {
    try {

      // retrieve user info in body request
      let challenge = request.body;


      // insert new user in table 
      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into challenge set ?", challenge);
      var privateKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_prof.key', 'utf8');


      response.status(200).json({
        url: `http://localhost:5050/challenge/evaluation/${jwt.sign({
          challenge_id: data[0].insertId,
          promo_id: challenge.promo_id
        }, privateKey, { algorithm: 'RS256' })}`
      })
    } catch (error) {
      next(error);
    }
  }
)

routerSimple.post<{}, {}>('/evaluation/:token', authorization,
  async (request, response, next: NextFunction) => {
    let user = request.body;
    user = { ...user, role_id: 2 }

    // insert new user in table 
    const db = DB.Connection;
    const data = await db.query<OkPacket>("insert into user set ?", user);
    const score = await db.query<OkPacket>("insert into score set ?", 0);
    let challenge_user = {
      challenge_id: response.locals.challenge_id,
      user_id: data[0].insertId,
      promo_id: response.locals.promo_id,
      score_id: score[0].insertId,
    }
    await db.query<OkPacket>("insert into challenge_user", challenge_user);
  }
)


const route_challenge = Router({ mergeParams: true })
route_challenge.use(ROUTES_RUD);
route_challenge.use(routerIndex);
route_challenge.use(routerSimple);

export const ROUTES_CHALLENGE = route_challenge;