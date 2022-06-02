import Ajv, {JSONSchemaType } from "ajv";
import { IScoreCreate, IScoreUpdate } from "./IScore";

const ScoreCreateSchema: JSONSchemaType<IScoreCreate> = {
    type: "object",
    properties: {
        nbScore : { type: 'number', nullable: false}
    },
    required: ["nbScore"],
    additionalProperties: false
};

const ScoreUpdateSchema: JSONSchemaType<IScoreUpdate> = {
  type: "object",
  properties: {
      nbScore: { type: 'number', nullable: false }
  },
  required: [],
  additionalProperties: false
};

const ajv = new Ajv();
export const ScoreCreateValidator = ajv.compile(ScoreCreateSchema);
export const ScoreUpdateValidator = ajv.compile(ScoreUpdateSchema);