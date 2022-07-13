import { CrudOperations, CrudRouter } from "./CrudRouter";
import { IPromoCreate, IPromoUpdate, IPromoRO, IPromo } from '../types/tables/promo/IPromo';
import { PromoCreateValidator, PromoUpdateValidator } from "../types/tables/promo/promo.validator";
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../classes/DB';
const jwt = require('jsonwebtoken');

export class Promo {
    public async createPromo(body: any) {
        try {
            // retrieve user_id in response & promo in body request
            let promo = body

            // insert new promo in table
            const db = DB.Connection
            const data = await db.query<OkPacket>("insert into PROMOS set ?", promo)

            // return new promo in response
            return {
                promo_id: data[0].insertId,
                promo: promo.promo
            }
        } catch (error) {
            throw error
        }
    }

    public async getPromo(page: number, limit: number, user_id: number) {
        try {
            // retrieve user_id in response & page/limit in body request
            const startData = Number(page) * Number(limit)

            // recovery total promo from user & promo depending on the settings
            const db = DB.Connection
            const total = await db.query<RowDataPacket[]>("select count(promo_id) as countPromo from PROMOS where user_id = ?", user_id)
            const data = await db.query<IPromoRO[] & RowDataPacket[]>("select promo_id, promo from PROMOS where user_id = ? limit ?, ?", [user_id, startData, Number(limit)])

            // return total & promos in response
            return {
                promos: data[0],
                total: total[0][0].countPromo
            }
        } catch (error) {
            throw (error)
        }
    }
}
