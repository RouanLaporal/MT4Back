import { ValidateFunction } from 'ajv';
import { NextFunction, Router } from 'express';
import { ICreateResponse } from '../types/api/ICreateResponse';
import { IIndexQuery, IIndexResponse } from '../types/api/IIndexQuery';
import { IUpdateResponse } from '../types/api/IUpdateResponse';
import { DbTable } from '../types/tables/tables';
import { Crud } from './Crud';


export enum CrudOperations {
  Index = 1,
  Create = 2,
  Read = 4,
  Update = 8,
  Delete = 16,
  All = ~0
}

export interface ICrudRouterOptions<CreateStructure,UpdateStructure> {
  /**
   * Nom de la table référencée par l'opération CRUD
   */
  table: DbTable;
  /**
   * Clé primaire de la table
   */
  primaryKey: string;
  /**
   * Operations à créer : utiliser le enum CrudOperations en bitwise afin de préciser les routes souhaitées
   */
  operations: CrudOperations;
  /**
   * Pour les opérations de lecture (Index et Read), les colonnes à retourner
   */
  readColumns: string[];
  /**
   * Pour les opérations d'écriture (Create et Update), les validators à appliquer
   */
  validators?: {
    create?: ValidateFunction<CreateStructure>;
    update?: ValidateFunction<UpdateStructure>
  }
}

/**
 * Créer les routes CRUD pour une ressource, selon la configuration passé. On peut choisir les opérations CRUD à créer
 * @param options 
 * @returns Router Express
 */
export const CrudRouter = <RecordStructure, CreateStructure, UpdateStructure>(options: ICrudRouterOptions<CreateStructure, UpdateStructure>) => {
  const crud = Router({ mergeParams: true });

  // Operations sans identifiant  
  if (options.operations < 4) {
    const routerIndex = Router({ mergeParams: true });
    
    // Index: GET /
    if ((options.operations & CrudOperations.Index) > 0) {
      routerIndex.get<{}, IIndexResponse<RecordStructure>, {}, IIndexQuery>('/',
        async (request, response, next: NextFunction) => {

          try {      
            
            const result = await Crud.Index<RecordStructure>(request.query, options.table, options.readColumns || ['*']);      
            response.json(result);

          } catch (err: any) {
            next(err);
          }

        }
      );
    }

    // Create: POST /
    if ((options.operations & CrudOperations.Create) > 0) {
      routerIndex.post<{}, ICreateResponse, CreateStructure>('/',
        async (request, response, next: NextFunction) => {

          try {
            const result = await Crud.Create<CreateStructure>(request.body, options.table, options.validators?.create);
            response.json(result);

          } catch (err: any) {
            next(err);
          }

        }
      );
    }

    crud.use(routerIndex);
  }

  // Operation sur une ligne précise, identifié par :recordId
  if (options.operations >= 4) {
    const routerSingle = Router({ mergeParams: true });

    interface ISingleParams {
      recordId: string;
    }

    // Read: Get /:recordId
    if ((options.operations & CrudOperations.Read) > 0) {
      routerSingle.get<ISingleParams, RecordStructure, {}, {}>('/',
        async (request, response, next: NextFunction) => {

          try {            
            const result = await Crud.Read<RecordStructure>(options.table, options.primaryKey, parseInt(request.params.recordId), options.readColumns);
            response.json(result);

          } catch (err: any) {
            next(err);
          }

        }
      );
    }



    // Update: PUT /:recordId
    if ((options.operations & CrudOperations.Update) > 0) {
      routerSingle.put<ISingleParams, IUpdateResponse, UpdateStructure, {}>('/',
        async (request, response, next: NextFunction) => {

          try {            
            const result = await Crud.Update<UpdateStructure>(request.body, options.table, options.primaryKey, parseInt(request.params.recordId), options.validators?.update);
            response.json(result);

          } catch (err: any) {
            next(err);
          }

        }
      );
    }


    // Delete: DELETE /:recordId
    if ((options.operations & CrudOperations.Delete) > 0) {
      routerSingle.delete<ISingleParams, IUpdateResponse, {}, {}>('/',
        async (request, response, next: NextFunction) => {

          try {            
            const result = await Crud.Delete(options.table, options.primaryKey, parseInt(request.params.recordId));
            response.json(result);

          } catch (err: any) {
            next(err);
          }

        }
      );
    }

    crud.use('/:recordId', routerSingle);
  }

  return crud;
}