/**
 * Un utilisateur de la plateforme.
 */
export interface IUser {
  /** ID Unique */
  user_id: number;
  /** Nom de famille */
  first_name?: string;
  /** Prénom */
  last_name?: string;
  /** Admin || Normal User */
  role_id?: number;
  /** Adresse-mail, ceci doit être unique est sera utilisé comme identifiant pour l'utilisateur */
  email: string;
  /** Avatar de l'utilisateur */
  avatar: string;
  /** Mot de passe de l'utilisateur */
  password: string;

  is_valid: boolean;
}

export type IUserCreate = Omit<IUser, 'user_id'>;
export type IUserUpdate = Partial<IUserCreate>;
export type IUserRO = Readonly<IUser>;