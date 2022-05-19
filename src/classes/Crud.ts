import { ValidateFunction } from 'ajv';
import { OkPacket, RowDataPacket } from 'mysql2';
import { ICreateResponse } from '../types/api/ICreateResponse';
import { IIndexQuery, IIndexResponse, IReadWhere } from '../types/api/IIndexQuery';
import { ITableCount } from '../types/api/ITableCount';
import { IUpdateResponse } from '../types/api/IUpdateResponse';
import { DbTable } from '../types/tables/tables';
import { DB } from './DB';
import { ApiError } from './Errors/ApiError';
import { ErrorCode } from './Errors/ErrorCode';




/**
 * Class qui fournit des fonctions utilitaires pour les opérations ICRUD.
 * 
 * @todo Pour l'instant la fonction Index ne marche que sur une seule table. Ajouter une fonction qui permet de faire des requêtes plus complexes (avec des joins et/ou aggrégations). Est-qu'il est possible de généraliser au maximum une telle opération, tout en laissant de la fléxibilité ?
 */
export class Crud {

  /**
   * Récupérer une page de lignes d'une table, en précisant les colonnes souhaitées
   * @param query L'objet contenant les paramètres optionnels de pagination.
   * @param table La table de la base de données à interroger
   * @param columns Un tableau de colonnes à retourner
   * @returns IIndexResponse contenant les résultats de la recherche.   
   * @todo Ajouter la possibilité de préciser les colonnes dans la requête ?
   */
  public static async Index<T>(query: IIndexQuery, table: DbTable, columns: string[], where?: IReadWhere) : Promise<IIndexResponse<T>> {

    const db = DB.Connection;      
    // On suppose que le params query sont en format string, et potentiellement
    // non-numérique, ou corrompu
    const page = parseInt(query.page || "0") || 0;
    // Toujours limiter la tailles des pages à 50 lignes
    const limit = Math.min(parseInt(query.limit || "10") || 0, 50);
    const offset = page * limit;

    // D'abord, récupérer le nombre total
    const count = await db.query<ITableCount[] & RowDataPacket[]>(`select count(*) as total from ${table}`);      

    // Récupérer les lignes
    const whereClause = (where ? `where ?`: '');
    const sqlBase = `select ${columns.join(',')} from ${table} limit ? offset ? ${whereClause}`;
    const data = await db.query<T[] & RowDataPacket[]>(sqlBase, [limit, offset, where]);      

    // Construire la réponse
    const res: IIndexResponse<T> = {
      page,
      limit,
      total: count[0][0].total,
      rows: data[0]
    }

    return res;
  }

  public static async Create<T>(body: T, table: DbTable, validator?: ValidateFunction<T>): Promise<ICreateResponse> {
    if (!validator || validator(body)) {
      const db = DB.Connection;
      const data = await db.query<OkPacket>(`insert into ${table} set ?`, body);

      return {
        id: data[0].insertId
      }   
    } else {
      throw new ApiError(ErrorCode.BadRequest, 'validation/failed', 'Data did not pass validation', validator.errors);      
    }
  }

  public static async Update<T>(body: T, table: DbTable, idName: string, idValue: number, validator?: ValidateFunction<T>): Promise<IUpdateResponse> {
    if (!validator || validator(body)) {
      const db = DB.Connection;

      const data = await db.query<OkPacket>(`update ${table} set ? where ${idName} = ?`, [body, idValue]);

      return {
        rows: data[0].affectedRows
      }   
    } else {
      throw new ApiError(ErrorCode.BadRequest, 'validation/failed', 'Data did not pass validation', validator.errors);      
    }
  }

  public static async Read<T>(table: DbTable, idName: string, idValue: number, columns: string[]): Promise<T> {
    const db = DB.Connection;
    const data = await db.query<T[] & RowDataPacket[]>(`select ${columns.join(',')} from ${table} where ${idName} = ?`, [idValue]);      

    if (data[0].length > 0) {
      return data[0][0];
    } else {
      throw new ApiError(ErrorCode.BadRequest, 'sql/not-found', `Could not read row with ${idName} = ${idValue}`);
    }
  }

  public static async Delete<T>(table: DbTable, idName: string, idValue: number): Promise<IUpdateResponse> {
    const db = DB.Connection;
    const data = await db.query<OkPacket>(`delete from ${table} where ${idName} = ?`, [idValue]);      

    return {
      rows: data[0].affectedRows
    }  
  }

}