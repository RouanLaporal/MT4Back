import { CrudOperations, CrudRouter } from "../../classes/CrudRouter";
import { ISshCreate, ISshUpdate, ISshRO } from "../../types/tables/ssh/ISsh";
import { SshCreateValidator, SshUpdateValidator } from "../../types/tables/ssh/ssh.validator";
const { Client } = require('ssh2');
const { readFileSync } = require('fs');

export const ROUTES_SSH = CrudRouter<ISshRO, ISshCreate, ISshUpdate>({
    table: 'ssh',
    primaryKey: 'sshId',
    operations: CrudOperations.Index | CrudOperations.Create | CrudOperations.Read | CrudOperations.Update | CrudOperations.Delete,
    readColumns: ['sshId', 'Username', 'IpAddress'],
    validators: {
        create: SshCreateValidator,
        update: SshUpdateValidator
    }
});

const conn = new Client();
export const connect = conn.on('ready', () => {
    console.log('Client :: ready');
    conn.exec('uptime', (err: any, stream: any) => {
        if (err) throw err;
        stream.on('close', (code: any, signal: any) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
        }).on('data', (data: any) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data: any) => {
            console.log('STDERR: ' + data);
        });
    });
}).connect({
    host: '142.93.233.40',
    port: 22,
    username: 'root',
    privateKey: readFileSync('/Users/rouan/.ssh/id_rsa')
});