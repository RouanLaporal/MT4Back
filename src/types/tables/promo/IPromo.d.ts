/**
 * Une promotion contenant plusieurs etudiants
 */
export interface IPromo {
    /** ID unique */
    promoId: number;
    /** nom de la promotion */
    name: string;
}

export type IPromoCreate = Omit<IPromo, 'promoId'>;
export type IPromoUpdate = IPromoCreate;
export type IPromoRO = Readonly<IPromo>;