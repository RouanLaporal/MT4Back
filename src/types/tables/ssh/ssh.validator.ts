import Ajv, { JSONSchemaType } from 'ajv';
import { ISshCreate, ISshUpdate } from './ISsh';



const SshCreateSchema: JSONSchemaType<ISshCreate> = {
    type: "object",
    properties: {
        Username: { type: 'string' },
        IpAddress: { type: 'string' },
    },
    required: ["Username", "IpAddress"],
    additionalProperties: false,
};


const SshUpdateSchema: JSONSchemaType<ISshUpdate> = {
    type: "object",
    properties: {
        Username: { type: 'string', nullable: true },
        IpAddress: { type: 'string', nullable: true },
    },
    additionalProperties: false,
};

const ajv = new Ajv();
export const SshCreateValidator = ajv.compile(SshCreateSchema);
export const SshUpdateValidator = ajv.compile(SshUpdateSchema);