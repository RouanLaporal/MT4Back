/**
 * Les différents challenges
 */
export interface IChallenge {
    /**
     * ID du challenge
     */
    challenge_id: number;
    /**
     * nom du challenge
     */
    challenge: string;
    /**
     * Status du challenge || true or false
     */
    is_active: boolean;

    user_id: number;

    promo_id: number;
    /**
     * url du challenge
     */
    url?: string;
}

export type IChallengeCreate = Omit<IChallenge, 'challenge_id'>;
export type IChallengeUpdate = Partial<IChallengeCreate>;
export type IChallengeRO = Readonly<IChallenge>;