import { NextFunction, Request, Response, Router } from 'express';
import { CrudOperations, CrudRouter } from "../../classes/CrudRouter";
import { ISshCreate, ISshUpdate, ISshRO } from "../../types/tables/ssh/ISsh";
import { SshCreateValidator, SshUpdateValidator } from "../../types/tables/ssh/ssh.validator";
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../../classes/DB';
import { execute } from '../../middleware/ssh-handler';
import mysql from 'mysql2';
import { SshCommand } from '../../classes/SshCommand';
import Connection from 'mysql2/typings/mysql/lib/Connection';

const tunnel = require('tunnel-ssh');
const { Client } = require('ssh2');
const { readFileSync } = require('fs');
const routerIndex = Router({ mergeParams: true });

export const route_RUD = CrudRouter<ISshRO, ISshCreate, ISshUpdate>({
    table: 'ssh',
    primaryKey: 'sshId',
    operations: CrudOperations.Index | CrudOperations.Create | CrudOperations.Read | CrudOperations.Update | CrudOperations.Delete,
    readColumns: ['sshId', 'Username', 'IpAddress'],
    validators: {
        create: SshCreateValidator,
        update: SshUpdateValidator
    }
});


routerIndex.post<{}, {}, ISshCreate>('/',
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            let connection_credentials = request.body
            const ssh_connection = new SshCommand(connection_credentials.IpAddress, connection_credentials.UserName);
            await ssh_connection.executeShell("ls \nexit\n");
            next();
        } catch (error) {
            next(error);
        }
    }
);
routerIndex.post<{}, {}, ISshCreate>('/sgbdr',
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            let connection_credentials = request.body
            const ssh_connection = new SshCommand(connection_credentials.IpAddress, connection_credentials.UserName);
            await ssh_connection.executeSgbdr("select * from user");
            response.json(true);
            next()
        } catch (error) {
            next(error);
        }
    }
);




const route_ssh = Router({ mergeParams: true })
// route_user.use(route_RUD);
route_ssh.use(routerIndex);
// route_user.use(routerSimple);

export const ROUTES_SSH = route_ssh;