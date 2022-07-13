import { CrudOperations, CrudRouter } from '../classes/CrudRouter';
import { IChallengeCreate, IChallengeRO, IChallengeUpdate } from '../types/tables/challenge/IChallenge';
import { ChallengeCreateValidator, ChallengeUpdateValidator } from '../types/tables/challenge/challenge.validator';
import { OkPacket, RowDataPacket } from 'mysql2';
import { DB } from '../classes/DB';
import { authorization } from '../middleware/authorization';
import { SGBDRInstance } from '../classes/SGBDRInstance';
import { ApiError } from '../classes/Errors/ApiError';
import { SshCommand } from '../classes/SshCommand';
const jwt = require('jsonwebtoken');
const fs = require('fs');


export class Challenge {
    public async getChallengeByUser(page: number, limit: number, user_id: string) {
        try {
            // retrieve user_id in response & page/limit in body request
            const startData = Number(page) * Number(limit)

            // recovery total challenge from user & challenge depending on the settings
            const db = DB.Connection;
            const total = await db.query<RowDataPacket[]>("select count(challenge_id) as countChallenge from CHALLENGES where user_id = ?", user_id);
            const data = await db.query<IChallengeRO[] & RowDataPacket[]>("select challenge_id, challenge, url, is_active, promo from CHALLENGES INNER JOIN PROMOS ON PROMOS.promo_id = CHALLENGES.promo_id where CHALLENGES.user_id = ? limit ?, ?", [user_id, startData, Number(limit)]);

            // return total & promos in response
            return {
                challenges: data[0],
                total: total[0][0].countChallenge
            }
        } catch (error) {
            throw (error)
        }
    }

    public async createChallenge(body: any) {
        try {
            // retrieve user_id in response & challenge in body request
            const { user_id } = body;
            const challenge = {
                challenge: body.challenge,
                is_active: body.is_active,
                promo_id: body.promo_id,
                user_id: user_id
            }

            // compare if challenge already existing
            const db = DB.Connection;
            var challenge_exist = await db.query<RowDataPacket[]>("select count(*) as countChallenge from CHALLENGES where challenge = ? AND promo_id = ? AND user_id = ?", [body.challenge, body.promo_id, user_id]);
            if (challenge_exist[0][0].countChallenge > 0) return (new ApiError(400, 'challenge/already-exist', 'Ce challenge existe déjà'))

            // insert new challenge in table 
            const data = await db.query<OkPacket>("insert into CHALLENGES set ?", challenge);
            var privateKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_prof.key', 'utf8');

            const token = jwt.sign({
                challenge_id: data[0].insertId,
                promo_id: body.promo_id,
                challenge: body.challenge
            }, privateKey, { algorithm: 'RS256' })

            const url = `${process.env.BASE_URL_FRONT}/auth/connect/${token}`

            await db.query<OkPacket>("update CHALLENGES set url =  ? where challenge_id = ?", [url, data[0].insertId]);
            const promoName = await db.query<RowDataPacket[]>("select promo from PROMOS where promo_id = ?", body.promo_id)

            // return new promo in response
            return {
                url,
                challenge_id: data[0].insertId,
                promo: promoName[0][0].promo,
                challenge: challenge.challenge,
                is_active: challenge.is_active
            }
        } catch (error) {
            throw (error);
        }
    }

    public async signupToChallenge(body: any, token: string) {
        try {
            const publicKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_prof.key.pub', 'utf8');
            const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
            const db = DB.Connection;
            const data = await db.query<IChallengeRO[] & RowDataPacket[]>("select * from CHALLENGES where challenge_id = ?", decodedToken.challenge_id)

            if (data[0][0].is_active == false) {
                return (new ApiError(403, 'challenge/not-active', "Can't access this challenge"));
            } else {
                const user = { ...body, role_id: 2, is_valid: true }
                const data_user = await db.query<OkPacket>("insert into USERS set ?", user);
                let participation = {
                    challenge_id: decodedToken.challenge_id,
                    user_id: data_user[0].insertId,
                    promo_id: decodedToken.promo_id,
                    score: 0,
                }
                const data = await db.query<OkPacket>("insert into PARTICIPATIONS set ?", participation);
                const privateKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_student.key', 'utf8');
                const student_token = jwt.sign({
                    user_id: data_user[0].insertId,
                }, privateKey, { algorithm: 'RS256' })
                const mailjet = require('node-mailjet')
                    .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
                const mj_request = mailjet
                    .post("send", { 'version': 'v3.1' })
                    .request({
                        "Messages": [
                            {
                                "From": {
                                    "Email": "rouan.laporal@outlook.com",
                                    "Name": "Rouan"
                                },
                                "To": [
                                    {
                                        "Email": body.email
                                    }
                                ],
                                "Subject": "Lancez votre challenge",
                                "TextPart": '<a href = http://localhost:5050/challenge/evaluation/SGBDR/' + student_token + '> Cliquer sur le lien !</ a > ',
                                "CustomID": "Challenge"
                            }
                        ]
                    })

                return (true)
            }
        } catch (error: any) {
            throw (error);
        }
    }

    public async testInstanceConnection(body: any) {
        try {
            const instance = {
                address_ip: body.address_ip,
                user_name: body.user_name,
            }
            const connection = new SshCommand(instance.address_ip, instance.user_name);
            await connection.executeShell("exit");
            return {
                "status": "success",
            }
        } catch (error: any) {
            throw (error)
        }
    }
    public async launchChallenge(token: string, body: any) {
        try {

            const db = DB.Connection;
            const publicKey = fs.readFileSync('/server/src/routes/auth/key/jwtRS256_student.key.pub', 'utf8');
            const decodedToken = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
            const { user_id } = decodedToken
            const user = {
                last_name: body.last_name,
                first_name: body.first_name,
            }

            const data = await db.query<OkPacket>("update USERS set first_name = ?,  last_name = ? where user_id = ?", [user.first_name, user.last_name, user_id]);

            const instance = {
                address_ip: body.address_ip,
                user_name: body.user_name,
                db_password: body.db_password,
                db_port: body.db_port
            }
            const ssh_tunnel = new SGBDRInstance(instance.address_ip, instance.user_name, instance.db_password, instance.db_port);
            const connection = await ssh_tunnel.config();
            ssh_tunnel.execute(connection, "use challenge_SGBDR", "Import the database");
            return {
                "status": "success",
            }


        } catch (error) {
            throw (error);
        }
    }
}