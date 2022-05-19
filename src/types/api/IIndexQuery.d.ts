/**
 * Les query parameters d'une requête de type Index, concernant principalement la pagination des résultats
 */
export interface IIndexQuery {
  /**
   * Le numéro de page (zéro-index), donc 0 = la première page, 1 = la deuxième page, etc.
   */
  page?: string;
  /**
   * Le nombre de lignes à retourner, attention, Le default = 10, mais limité à 50.
   */
  limit?: string;  
}

export type IReadWhere = Record<string, string|number>;

/**
 * La structure d'une réponse à une requête Index.
 */
export interface IIndexResponse<T> {
  /**
   * Le numéro de la page demandée
   */
  page: number;
  /**
   * Le nombre de lignes demandée
   */
  limit: number;
  /**
   * Le nombre total de lignes dans la table
   */
  total: number;
  /**
   * Les lignes
   */
  rows: T[];
}