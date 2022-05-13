import Ajv, { JSONSchemaType } from 'ajv';
import { IUserCreate, IUserUpdate } from './IUser';



const UserCreateSchema : JSONSchemaType<IUserCreate> = {
  type: "object",
  properties: {
    familyName: { type: 'string', nullable: true },
    givenName: { type: 'string', nullable: true},
    email: { type: 'string' },  
  },
  required: ["email"],
  additionalProperties: false,
};


const UserUpdateSchema : JSONSchemaType<IUserUpdate> = {
  type: "object",
  properties: {
    familyName: { type: 'string', nullable: true },
    givenName: { type: 'string', nullable: true },
    email: { type: 'string', nullable: true },  
  },  
  additionalProperties: false,
};

const ajv = new Ajv();
export const UserCreateValidator = ajv.compile(UserCreateSchema);
export const UserUpdateValidator = ajv.compile(UserUpdateSchema);