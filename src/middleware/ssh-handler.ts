import { Request, Response, NextFunction } from "express";
const { Client } = require('ssh2');
const { readFileSync } = require('fs');

export const execute = (command: string) => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const connection = request.body;
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
                host: connection.IpAddress,
                port: 22,
                username: connection.UserName,
                privateKey: readFileSync('/root/.ssh/id_rsa')
            });
        });
        response.json(true);
    } catch (error) {
        next(error);
    }
}