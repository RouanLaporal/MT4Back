import Ajv, { JSONSchemaType } from "ajv";
import { IPromoCreate, IPromoUpdate } from './IPromo';

const PromoCreateSchema: JSONSchemaType<IPromoCreate> = {
    type: "object",
    properties: {
        name: { type: "string", nullable: false }
    },
    required: ["name"],
    additionalProperties: false
};

const PromoUpdateSchema: JSONSchemaType<IPromoUpdate> = {
    type: "object",
    properties: {
        name: {type: "string", nullable: false }
    },
    required: [],
    additionalProperties: false
};

const ajv = new Ajv();
export const PromoCreateValidator = ajv.compile(PromoCreateSchema);
export const PromoUpdateValidator = ajv.compile(PromoUpdateSchema);