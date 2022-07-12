import { Request, Response, NextFunction, request } from 'express';
import { DB } from '../classes/DB';
import { OkPacket, RowDataPacket } from 'mysql2';

import mysql from 'mysql2';

const { Client } = require('ssh2');
const { readFileSync } = require('fs');
const tunnel = require('tunnel-ssh');
export class SGBDRInstance {
    constructor(
        private address_ip: string,
        private user_name: string,
        private db_password: string,
        private db_port: number,

    ) { }


    public getAddressIp(): string {
        return this.address_ip;
    }


    public getUserName(): string {
        return this.user_name;
    }
    public getDbPort(): number {
        return this.db_port;
    }
    public getDbPassword(): string {
        return this.db_password;
    }

    public setAddressIp(address_ip: string) {
        this.address_ip = address_ip;
    }

    public setUserName(user_name: string) {
        this.user_name = user_name;
    }

    public async handle(query: string, hint: string, response: Response) {
        try {
            const db = DB.Connection;
            const dbServer = {
                host: '127.0.0.1',
                port: this.getDbPort(),
                user: this.getUserName(),
                password: this.getDbPassword(),
                database: 'challenge_SGBDR',
            }
            var config = {
                username: 'root',
                host: this.getAddressIp(),
                privateKey: readFileSync('/root/.ssh/id_rsa'),
                port: 22,
                dstPort: this.getDbPort(),
                localHost: '127.0.0.1',
                localPort: this.getDbPort()
            };
            await new Promise((resolve, reject) => {
                tunnel(config, function (error: any, server: any) {
                    server.on("error", (error: any) => {
                        reject(error);
                        return;
                    })
                    if (error) reject(error);
                    console.log('Tunnel Connected');
                    const connection = mysql.createConnection(dbServer);
                    connection.on('error', (error: any) => { reject(error); });
                    connection.connect((error) => {
                        if (error) response.status(200).json({
                            status: "error",
                            hint: hint
                        });
                        console.log('Mysql connected as id ' + connection.threadId);
                        connection.query(query);
                        connection.end();
                        resolve(connection);
                    })
                });

            });
            // await db.query<OkPacket>("update PARTICIPATON set score = ? where user_id = ?", [1, user_id]);
        } catch (error) {
            throw error;
        }
    }
}





