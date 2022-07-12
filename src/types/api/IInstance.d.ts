/**
 * Une Instance de la plateforme.
 */
 export interface IInstance {
    /** ID Unique */
    address_ip: string;
    /** Nom d'utilisateur */
    user_name: string;
    /** Mot de passe de la base de données */
    db_password: string;
    /** Port de la base de données */
    db_port: number;
    /** Prénom de l'utilisateur */
    first_name: string;
    /** Prénom de l'utilisateur */
    last_name: string;
  }
  
  export type IInstanceRO = Readonly<IInstance>;