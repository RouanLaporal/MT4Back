import Ajv, { JSONSchemaType } from 'ajv';
import { IChallengeCreate, IChallengeUpdate } from './IChallenge';

const ChallengeCreateSchema: JSONSchemaType<IChallengeCreate> = {
    type: "object",
    properties: {
        challenge: { type: 'string' },
        is_active: { type: 'boolean' },
        user_id: { type: 'number' },
        promo_id: { type: 'number' },
        url: { type: 'string', nullable: true }
    },
    required: ['challenge', 'is_active'],
    additionalProperties: false,
};

const ChallengeUpdateSchema: JSONSchemaType<IChallengeUpdate> = {
    type: "object",
    properties: {
        challenge: { type: 'string', nullable: true },
        is_active: { type: 'boolean', nullable: true },
        user_id: { type: 'number', nullable: true },
        promo_id: { type: 'number', nullable: true },
        url: { type: 'string', nullable: true }
    },
    required: [],
    additionalProperties: false,
};

const ajv = new Ajv();
export const ChallengeCreateValidator = ajv.compile(ChallengeCreateSchema);
export const ChallengeUpdateValidator = ajv.compile(ChallengeUpdateSchema);