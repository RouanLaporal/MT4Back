import { NextFunction, Request, Response, Router } from 'express';
import { CrudOperations, CrudRouter } from "../../classes/CrudRouter";
import { SshCommand } from '../../classes/SshCommand';
const { Client } = require('ssh2');
const { readFileSync } = require('fs');
const routerIndex = Router({ mergeParams: true });



routerIndex.post('/',
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
routerIndex.post('/sgbdr',
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