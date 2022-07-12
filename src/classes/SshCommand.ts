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
}





