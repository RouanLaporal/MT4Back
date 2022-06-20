import { NextFunction, Request, Response, Router } from 'express';
import { CrudOperations, CrudRouter } from  "../classes/CrudRouter";
import { IPromoCreate, IPromoUpdate, IPromoRO, IPromo } from '../types/tables/promo/IPromo';
import { PromoCreateValidator, PromoUpdateValidator } from "../types/tables/promo/promo.validator";
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../classes/DB';
import { IUser } from '../types/tables/user/IUser';

const routerIndex = Router({ mergeParams: true });

export const ROUTES_PROMO = CrudRouter<IPromoRO, IPromoCreate, IPromoUpdate>({
    table: 'promo',
    primaryKey: 'promoId',
    operations: CrudOperations.Index | CrudOperations.Create |CrudOperations.Read |CrudOperations.Update | CrudOperations.Update,
    readColumns: ['promoId', 'name'],
    validators: {
        create: PromoCreateValidator,
        update: PromoUpdateValidator
    }
});

routerIndex.post<{}, {}, IPromoCreate>('/', 
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            const promo = request.body

            const db = DB.Connection
            await db.query<OkPacket>("insert into promo set ?", promo)

            response.json(true)
        } catch (error) {
            next(error)
        }
    }
)

routerIndex.get<{}, {}, IPromoRO>('/', 
async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { page = 0, limit = 20 } = request.query
        const statData = Number(page) * Number(limit)

        const db = DB.Connection
        const total = await db.query<OkPacket>("select count(id) from promo")
        const data = await db.query<IPromoRO[] & RowDataPacket[]>("select name from promo limit ?,?", { statData,limit })

        response.json({
            promos: data,
            total
        })
    } catch (error) {
        next(error)
    }
}
)

routerIndex.put<{}, {}, IPromoUpdate>('/:id',
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params
            const name = request.body

            const db = DB.Connection
            await db.query<OkPacket>("update promo set name = ? where id = ?", { name, id })

            response.json(true)
        } catch (error) {
            next(error)
        }
    }
)

routerIndex.delete<{}, {}, IPromo>('/:id', 
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params

            const db = DB.Connection
            await db.query<OkPacket>("delete from promo where id = ?", { id })
            
            response.json(true)
        } catch (error) {
            next(error)
        }
    }
)