import Ajv, { JSONSchemaType } from "ajv";
import { IValidationCreate, IValidationUpdate } from "./IValidation";

const ValidationCreateSchema: JSONSchemaType<IValidationCreate> = {
    type: "object",
    properties: {
        code: { type: 'number' },
        user_id: { type: 'number' }
    },
    required: ["code"],
    additionalProperties: false
}

const ValidationUpdateSchema: JSONSchemaType<IValidationUpdate> = {
    type: "object",
    properties: {
        code: { type: 'number', nullable: true },
        user_id: { type: 'number', nullable: true }
    },
    required: [],
    additionalProperties: false
}

const ajv = new Ajv();
export const ValidationCreateValidator = ajv.compile(ValidationCreateSchema);
export const ValidationUpdateValidator = ajv.compile(ValidationUpdateSchema);