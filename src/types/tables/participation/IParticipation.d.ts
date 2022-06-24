/**
 * Les participations de la plateforme.
 */
 export interface IParticipation {
    /** ID Unique d'un utilisateur*/
    user_id: number;
    /** ID du challenge */
    challenge_id: number;
    /** ID de la promo */
    promo_id: number;
    /** Score de l'utilisateur pour tel challenge */
    score: number;
  }
  
  export type IParticipationCreate = IParticipation;
  export type IParticipationUpdate = Partial<IParticipationCreate>;
  export type IParticipationRO = Readonly<IParticipation>;