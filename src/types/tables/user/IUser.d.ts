
// Définition d'un structure IUser
// A noter, le ? veut dire que le champ est optionnel

export interface IUser {
  userId: number;
  familyName?: string;
  givenName?: string;
  email: string;
}

export type IUserCreate = Omit<IUser, 'userId'>;
export type IUserUpdate = Partial<IUserCreate>;
export type IUserRO = Readonly<IUser>;