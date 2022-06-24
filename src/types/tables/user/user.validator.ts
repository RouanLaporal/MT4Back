import Ajv, { JSONSchemaType } from 'ajv';
import { IUserCreate, IUserUpdate } from './IUser';



const UserCreateSchema: JSONSchemaType<IUserCreate> = {
  type: "object",
  properties: {
    first_name: { type: 'string', nullable: true },
    last_name: { type: 'string', nullable: true },
    role_id: { type: 'number', nullable: true },
    email: { type: 'string' },
    avatar: { type: 'string' },
    password: { type: 'string' },
    is_valid: { type: 'boolean'}
  },
  required: ["email"],
  additionalProperties: false,
};


const UserUpdateSchema: JSONSchemaType<IUserUpdate> = {
  type: "object",
  properties: {
    first_name: { type: 'string', nullable: true },
    last_name: { type: 'string', nullable: true },
    role_id: { type: 'number', nullable: true },
    email: { type: 'string', nullable: true },
    avatar: { type: 'string', nullable: true },
    password: { type: 'string', nullable: true },
    is_valid: { type: 'boolean', nullable: true}
  },
  required: [],
  additionalProperties: false,
};

const ajv = new Ajv();
export const UserCreateValidator = ajv.compile(UserCreateSchema);
export const UserUpdateValidator = ajv.compile(UserUpdateSchema);