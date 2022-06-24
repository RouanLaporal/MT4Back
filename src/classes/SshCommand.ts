import { Request, Response, NextFunction, request } from 'express';
import mysql from 'mysql2';

const { Client } = require('ssh2');
const { readFileSync } = require('fs');
const tunnel = require('tunnel-ssh');
export class SshCommand {
    constructor(
        private address_ip: string,
        private user_name: string
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
    public async executeShell(command: string) {
        try {
            const conn = new Client();
            await new Promise<{ stdout: string, stderr: string }>((resolve, reject) => {
                let stdout: string = '';
                let stderr: string = '';
                conn.on("error", (error: any) => {
                    reject(error);
                    return;
                })
                conn.on('ready', () => {
                    console.log('Client :: ready');
                    conn.shell((err: any, stream: any) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        stream.on('close', () => {
                            console.log('Stream :: close');
                            resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
                            conn.end();
                        }).on('data', (data: string) => {
                            stdout += data;
                            console.log(stdout);
                        });
                        stream.end(command + "\nexit\n");
                    });
                }).connect({
                    host: this.getAddressIp(),
                    port: 22,
                    username: this.getUserName(),
                    privateKey: readFileSync('/root/.ssh/id_rsa')
                });
            });
            return true;
        } catch (error) {
            throw error;
        }
    }

    public async executeSgbdr(query: string) {
        try {

            const dbServer = {
                host: '127.0.0.1',
                port: 5001,
                user: 'root',
                password: 'test_mdp',
                database: 'test',
            }
            var config = {
                username: 'root',
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





