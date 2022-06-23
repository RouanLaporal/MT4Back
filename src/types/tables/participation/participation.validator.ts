import Ajv, { JSONSchemaType } from 'ajv';
import { IParticipationCreate, IParticipationUpdate } from './IParticipation';



const ParticipationCreateSchema: JSONSchemaType<IParticipationCreate> = {
  type: "object",
  properties: {
    user_id: { type: 'number' },
    challenge_id: { type: 'number' },
    promo_id: { type: 'number' },
    score: { type: 'number' }
  },
  required:['user_id', 'challenge_id', 'promo_id', 'score'],
  additionalProperties: false,
};


const ParticipationUpdateSchema: JSONSchemaType<IParticipationUpdate> = {
  type: "object",
  properties: {
    user_id: { type: 'number', nullable: true },
    challenge_id: { type: 'number', nullable: true },
    promo_id: { type: 'number', nullable: true },
    score: { type: 'number', nullable: true }
  },
  required:[],
  additionalProperties: false,
};

const ajv = new Ajv();
export const ParticipationCreateValidator = ajv.compile(ParticipationCreateSchema);
export const ParticipationUpdateValidator = ajv.compile(ParticipationUpdateSchema);