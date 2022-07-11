import { NextFunction, Request, Response, Router } from 'express';
import { CrudOperations, CrudRouter } from "../classes/CrudRouter";
import { IPromoCreate, IPromoUpdate, IPromoRO, IPromo } from '../types/tables/promo/IPromo';
import { PromoCreateValidator, PromoUpdateValidator } from "../types/tables/promo/promo.validator";
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../classes/DB';
import { authorization } from '../middleware/authorization';
const jwt = require('jsonwebtoken');

const routerIndex = Router({ mergeParams: true });
const routerSimple = Router({ mergeParams: true });

export const ROUTES_CRUD = CrudRouter<IPromoRO, IPromoCreate, IPromoUpdate>({
    table: 'promo',
    primaryKey: 'promo_id',
    operations: CrudOperations.Index | CrudOperations.Read | CrudOperations.Create | CrudOperations.Update | CrudOperations.Delete,
    readColumns: ['promo_id', 'promo', 'user_id'],
    validators: {
        create: PromoCreateValidator,
        update: PromoUpdateValidator
    }
});

routerSimple.post<{}, {}, IPromoCreate>('/',
    authorization('professor'),
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            // retrieve user_id in response & promo in body request
            const { user_id } = response.locals
            let promo = request.body
            promo = { ...promo, user_id }

            // insert new promo in table
            const db = DB.Connection
            const data = await db.query<OkPacket>("insert into promo set ?", promo)

            // return new promo in response
            response.json({
                promo_id: data[0].insertId,
                promo: promo.promo
            })
        } catch (error) {
            next(error)
        }
    }
)

routerSimple.get<{}, {}, IPromoRO>('/',
    authorization('professor'),
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            // retrieve user_id in response & page/limit in body request
            const { user_id } = response.locals
            const { page = 0, limit = 20 } = request.query
            const startData = Number(page) * Number(limit)

            // recovery total promo from user & promo depending on the settings
            const db = DB.Connection
            const total = await db.query<RowDataPacket[]>("select count(promo_id) as countPromo from promo where user_id = ?", user_id)
            const data = await db.query<IPromoRO[] & RowDataPacket[]>("select promo_id, promo from promo where user_id = ? limit ?, ?", [user_id, startData, Number(limit)])

            // return total & promos in response
            response.json({
                promos: data[0],
                total: total[0][0].countPromo
            })
        } catch (error) {
            next(error)
        }
    }
)

routerSimple.put<{}, {}, IPromoUpdate>('/:id',
    authorization,
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            // retrieve info promo 
            const { id } = request.params
            const promo = request.body

            // update promo in table
            const db = DB.Connection
            const data = await db.query<OkPacket>("update promo set promo = ? where promo_id = ?", [promo, id])

            // return true in response
            response.json(true)
        } catch (error) {
            next(error)
        }
    }
)

routerSimple.delete<{}, {}, IPromo>('/:id',
    authorization,
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            // retrieve promo_id in params request
            const { id } = request.params

            // delete promo in table
            const db = DB.Connection
            await db.query<OkPacket>("delete from promo where promo_id = ?", id)

            // return true in response
            response.json(true)
        } catch (error) {
            next(error)
        }
    }
)

const route_promo = Router({ mergeParams: true })
// route_promo.use(ROUTES_CRUD);
route_promo.use(routerIndex);
route_promo.use(routerSimple);

export const ROUTES_PROMO = route_promo;