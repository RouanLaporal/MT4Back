
export interface IChallenge {
    challengeId: number;
    status: string;
    name: string;
}

export type IChallengeCreate = Omit<IChallenge, 'challengeId'>;
export type IChallengeUpdate = Partial<IChallengeCreate>;
export type IChallengeRO = Readonly<IChallenge>;