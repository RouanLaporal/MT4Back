import Ajv, { JSONSchemaType } from 'ajv';
import { IChallengeCreate, IChallengeUpdate } from './IChallenge';

const ChallengeCreateSchema: JSONSchemaType<IChallengeCreate> = {
    type: "object",
    properties: {
        status: { type: 'string' },
        name: { type: 'string' }
    },
    required: ['status', 'name'],
    additionalProperties: false,
}

const ChallengeUpdateSchema: JSONSchemaType<IChallengeUpdate> = {
    type: "object",
    properties: {
        status: { type: 'string', nullable: true },
        name: { type: 'string', nullable: true },
    },
    additionalProperties: false,
}

const ajv = new Ajv();
export const ChallengeCreateValidator = ajv.compile(ChallengeCreateSchema);
export const ChallengeUpdateValidator = ajv.compile(ChallengeUpdateSchema);