import { CrudOperations, CrudRouter } from  "../classes/CrudRouter";
import { IParticipationCreate, IParticipationUpdate, IParticipationRO } from "../types/tables/participation/IParticipation";
import { ParticipationCreateValidator, ParticipationUpdateValidator } from "../types/tables/participation/participation.validator";
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../classes/DB';
import { NextFunction, request, Request, Response, Router } from 'express';
import { authorization } from '../middleware/authorization';

const routerIndex = Router({ mergeParams: true });
const routerSimple = Router({ mergeParams: true });
const jwt = require('jsonwebtoken');

export const ROUTES_PARTICIPATION = CrudRouter<IParticipationRO, IParticipationCreate, IParticipationUpdate>({
    table: 'participation',
    primaryKey: 'participation_id',
    operations: CrudOperations.Index | CrudOperations.Create |CrudOperations.Read |CrudOperations.Update | CrudOperations.Delete,
    readColumns: ['user_id', 'challenge_id', 'promo_id', 'score'],
    validators: {
        create: ParticipationCreateValidator,
        update: ParticipationUpdateValidator
    }
});

routerSimple.get('/allUsersByChallenge',
    authorization('professor'),
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            // retrieve user_id in response & page/limit in body request
            const { challenge_id } = request.params

            // recovery total promo from user & promo depending on the settings
            const db = DB.Connection
            const data = await db.query<IParticipationRO[] & RowDataPacket[]>("select score, challenge, promo, last_name, first_name from PARTICIPATIONS INNER JOIN CHALLENGES INNER JOIN PROMOS INNER JOIN USERS ON USERS.user_id = PROMOS.user_id ON PROMOS.promo_id = CHALLENGES.promo_id ON CHALLENGES.challenge_id = PARTICIPATIONS.challenge_id where PARTICIPATIONS.challenge_id = ?", challenge_id)

            // return total & promos in response
            response.json({
                participations: data[0]
            })
        } catch (error) {
            next(error)
        }
    }
)

const route_participation = Router({ mergeParams: true })
route_participation.use(ROUTES_PARTICIPATION);
route_participation.use(routerIndex);
route_participation.use(routerSimple);

export const ROUTES_PROMO = route_participation;

