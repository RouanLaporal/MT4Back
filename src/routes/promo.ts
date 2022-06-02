import { CrudOperations, CrudRouter } from  "../classes/CrudRouter";
import { IPromoCreate, IPromoUpdate, IPromoRO } from "../types/tables/promo/IPromo";
import { PromoCreateValidator, PromoUpdateValidator } from "../types/tables/promo/promo.validator";

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