/**
 * Changement de mot de passe d'un utilisateur.
 */
 export interface IChangePassword {
    /** email de l'utilisateur */
    email: string;
    /** Ancien mot de passe d'un utilisateur */
    oldPassword: string;
    /** Ancien mot de passe d'un utilisateur */
    newPassword: string;
  }
  
  export type IChangePasswordUpdate = IChangePassword;