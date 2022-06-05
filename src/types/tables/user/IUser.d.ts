

/**
 * Un utilisateur de la plateforme.
 */
export interface IUser {
  /** ID Unique */
  userId: number;
  /** Nom de famille */
  firstName?: string;
  /** Prénom */
  lastName?: string;
  /** Admin || Normal User */
  roleId: number;
  /** Adresse-mail, ceci doit être unique est sera utilisé comme identifiant pour l'utilisateur */
  email: string;

  avatar: string;

  password: string;
}

export type IUserCreate = Omit<IUser, 'userId'>;
export type IUserUpdate = Partial<IUserCreate>;
export type IUserRO = Readonly<IUser>;