import { CrudOperations, CrudRouter } from '../classes/CrudRouter';
import { IChallengeCreate, IChallengeRO, IChallengeUpdate } from '../types/tables/challenge/IChallenge';
import { ChallengeCreateValidator, ChallengeUpdateValidator } from '../types/tables/challenge/challenge.validator';
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../classes/DB';
import { NextFunction, request, Request, Response, Router } from 'express';
import { authorization } from '../middleware/authorization';
import { SGBDRInstance } from '../classes/SGBDRInstance';
import { ApiError } from '../classes/Errors/ApiError';
import { SshCommand } from '../classes/SshCommand';

const routerIndex = Router({ mergeParams: true });
const routerSimple = Router({ mergeParams: true });
const jwt = require('jsonwebtoken');
const fs = require('fs');




export const ROUTES_RUD = CrudRouter<IChallengeRO, IChallengeCreate, IChallengeUpdate>({
  table: 'CHALLENGES',
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
    const total = await db.query<RowDataPacket[]>("select count(challenge_id) as countChallenge from CHALLENGES where user_id = ?", user_id)
    const data = await db.query<IChallengeRO[] & RowDataPacket[]>("select * from CHALLENGES where user_id = ?", user_id);
    response.json({
      challenge: data[0],
      total: total[0][0].countPromo
    })
  })



routerIndex.post<{}, {}>('/', authorization('professor'),
  async (request: Request, response: Response, next: NextFunction) => {
    try {

      const { user_id } = response.locals;
      const challenge = {
        challenge: request.body.challenge,
        is_active: request.body.is_active,
        promo_id: request.body.promo_id,
        user_id: user_id
      }


      // insert new challenge in table 
      const db = DB.Connection;
      const data = await db.query<OkPacket>("insert into CHALLENGES set ?", challenge);
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
    try {
      const { token } = request.params;
      const publicKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_prof.key.pub', 'utf8');
      const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      const db = DB.Connection;
      const data = await db.query<IChallengeRO[] & RowDataPacket[]>("select * from CHALLENGES where challenge_id = ?", decodedToken.challenge_id)

      if (data[0][0].is_active == false) {
        next(new ApiError(403, 'challenge/not-active', "Can't access this challenge"));
      } else {
        let email = request.body;
        email = { ...email, role_id: 2, is_valid: true }
        const data_user = await db.query<OkPacket>("insert into USERS set ?", email);
        let participation = {
          challenge_id: decodedToken.challenge_id,
          user_id: data_user[0].insertId,
          promo_id: decodedToken.promo_id,
          score: 0,
        }
        const data = await db.query<OkPacket>("insert into PARTICIPATIONS set ?", participation);
        const privateKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_student.key', 'utf8');
        const student_token = jwt.sign({
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
                    "Email": request.body.email
                  }
                ],
                "Subject": "Lancez votre challenge",
                "TextPart": `http://localhost:5050/challenge/evaluation/SGBDR/${student_token}`,
                "CustomID": "Challenge"
              }
            ]
          })

        response.status(200).json(true)
      }
    } catch (error: any) {
      next(error);
    }
  }

)

routerSimple.post('/desactivation/:challenge_id', authorization('professor'),
  async (request: Request, response: Response, next: NextFunction) => {
    const { challenge_id } = request.params;
    const db = DB.Connection;
    const data = await db.query<OkPacket>("update CHALLENGE set is_active = 0  where challenge_id =  ? AND  user_id = ?", [challenge_id, response.locals.user_id]);
    return {
      rows: data[0].affectedRows
    }
  }
)

routerSimple.post('/connection/test/',
  async (request: Request, response, next: NextFunction) => {
    try {
      const instance = {
        address_ip: request.body.address_ip,
        user_name: request.body.user_name,
      }
      const connection = new SshCommand(instance.address_ip, instance.user_name);
      await connection.executeShell("exit");
      response.json({
        "status": "success",
      })
    } catch (error: any) {
      next(error)
    }
  })

routerSimple.post('/evaluation/SGBDR/:token', authorization('student'),
  async (request: Request, response, next: NextFunction) => {

    try {

      const db = DB.Connection;
      const { token } = request.params;
      const publicKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_student.key.pub', 'utf8');
      const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      const { user_id } = decodedToken
      const user = {
        last_name: request.body.last_name,
        first_name: request.body.first_name,
      }

      const data = await db.query<OkPacket>("update USERS set first_name = ?,  last_name = ? where user_id = ?", [user.first_name, user.last_name, user_id]);

      const instance = {
        address_ip: request.body.address_ip,
        user_name: request.body.user_name,
        db_password: request.body.db_password,
        db_port: request.body.db_port
      }
      const connection = new SGBDRInstance(instance.address_ip, instance.user_name, instance.db_password, instance.db_port);
      await connection.handle("use challenge_SGBDR", "The challenge_SGBDR database does not exist", response);
      response.json({
        "status": "success",
      })
      next();


    } catch (error) {
      next(error);
    }
  }
)

routerSimple.post('/SGBDR', authorization('student'),
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const db = DB.Connection;
      const instance = {
        address_ip: request.body.address_ip,
        user_name: request.body.user_name,
        db_password: request.body.db_password,
        db_port: request.body.db_port
      }
      const connection = new SGBDRInstance(instance.address_ip, instance.user_name, instance.db_password, instance.db_port);
      await connection.handle("use challenge_SGBDR", "The challenge_SGBDR database does not exist", response);
      await connection.handle("INSERT INTO `User` VALUES ('0000f9eb-42cd-452d-beb7-cebf673c0336','Celia_Lind@yahoo.com','Lind','Celia','Territoire de Belfort')", "", response);
    } catch (error) {
      next(error)
    }
  }
)




const route_challenge = Router({ mergeParams: true })
route_challenge.use(ROUTES_RUD);
route_challenge.use(routerIndex);
route_challenge.use(routerSimple);

export const ROUTES_CHALLENGE = route_challenge;
