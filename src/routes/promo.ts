import { NextFunction, Request, Response, Router } from 'express';
import { CrudOperations, CrudRouter } from  "../classes/CrudRouter";
import { IPromoCreate, IPromoUpdate, IPromoRO, IPromo } from '../types/tables/promo/IPromo';
import { PromoCreateValidator, PromoUpdateValidator } from "../types/tables/promo/promo.validator";
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../classes/DB';

const routerIndex = Router({ mergeParams: true });
const routerSimple = Router({ mergeParams: true });

export const ROUTES_CRUD = CrudRouter<IPromoRO, IPromoCreate, IPromoUpdate>({
    table: 'promo',
    primaryKey: 'promoId',
    operations: CrudOperations.Index | CrudOperations.Read | CrudOperations.Create |CrudOperations.Update | CrudOperations.Delete,
    readColumns: ['promoId', 'name'],
    validators: {
        create: PromoCreateValidator,
        update: PromoUpdateValidator
    }
});

routerSimple.post<{}, {}, IPromoCreate>('/', 
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            const name = request.body

            const db = DB.Connection
            const data = await db.query<OkPacket>("insert into promo set ?", name)

            response.json({
                promoId: data[0].insertId,
                name: name.name
            })
        } catch (error) {
            next(error)
        }
    }
)

routerSimple.get<{}, {}, IPromoRO>('/', 
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { page = 0, limit = 20 } = request.query
            const startData = Number(page) * Number(limit)

            const db = DB.Connection
            const total = await db.query<RowDataPacket[]>("select count(promoId) as countPromo from promo")
            const data = await db.query<IPromoRO[] & RowDataPacket[]>("select promoId, name from promo limit ?, ?", [startData,Number(limit)])

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
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params
            const name = request.body

            const db = DB.Connection
            const data = await db.query<OkPacket>("update promo set name = ? where promoId = ?", [name, id])

            response.json({
                id,
                name: name.name
            })
        } catch (error) {
            next(error)
        }
    }
)

routerSimple.delete<{}, {}, IPromo>('/:id', 
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params

            const db = DB.Connection
            const data = await db.query<OkPacket>("delete from promo where promoId = ?", id)

            response.json({
                id
            })
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