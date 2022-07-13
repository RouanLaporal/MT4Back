import Ajv, { JSONSchemaType } from "ajv";
import { IPromoCreate, IPromoUpdate } from './IPromo';

const PromoCreateSchema: JSONSchemaType<IPromoCreate> = {
    type: "object",
    properties: {
        promo: { type: "string", nullable: false },
        user_id: { type: "number" }
    },
    required: ["promo"],
    additionalProperties: false
};

const PromoUpdateSchema: JSONSchemaType<IPromoUpdate> = {
    type: "object",
    properties: {
        promo: { type: "string" },
    },
    required: ['promo'],
    additionalProperties: false
};

const ajv = new Ajv();
export const PromoCreateValidator = ajv.compile(PromoCreateSchema);
export const PromoUpdateValidator = ajv.compile(PromoUpdateSchema);