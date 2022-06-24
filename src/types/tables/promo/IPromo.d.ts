/**
 * Une promotion associé à un utilisateur || admin
 */
export interface IPromo {
    /** ID unique de la prom*/
    promo_id: number;
    /** nom de la promotion */
    promo: string;
    /**ID utilisateur associé à une promo*/
    user_id: number;
}

export type IPromoCreate = Omit<IPromo, 'promo_id'>;
export type IPromoUpdate = IPromoCreate;
export type IPromoRO = Readonly<IPromo>;