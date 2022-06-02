/**
 * Un score par utilisateur
 */
export interface IScore {
    /** ID unique */
    scoreId: number;
    /**score total de l'utilisateur (student) */
    nbScore: number;
}

export type IScoreCreate = Omit<IScore, 'scoreId'>;
export type IScoreUpdate = IScoreCreate;
export type IScoreRO = Readonly<IScore>;