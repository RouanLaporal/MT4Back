import { Request, Response, NextFunction, request } from 'express';
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
        return this.address_ip
    }


    public getUserName(): string {
        return this.user_name
    }

    public setAddressIp(address_ip: string) {
        this.address_ip = address_ip;
    }

    public setUserName(user_name: string) {
        this.user_name = user_name;
    }

    public async handle(query: string) {
        try {

            const dbServer = {
                host: '127.0.0.1',
                port: 5001,
                user: this.getUserName(),
                password: 'test_mdp',
                database: 'challenge_SGBDR',
            }
            var config = {
                username: this.getUserName(),
                host: this.getAddressIp(),
                privateKey: readFileSync('/root/.ssh/id_rsa'),
                port: 22,
                dstPort: 5001,
                localHost: '127.0.0.1',
                localPort: 5001
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
                        if (error) throw error;
                        console.log('Mysql connected as id ' + connection.threadId);
                        connection.query(query);
                        resolve(connection);
                    })
                });


            });
        } catch (error) {
            throw error;
        }
    }
}





