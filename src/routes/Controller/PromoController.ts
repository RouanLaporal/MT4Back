import { Body, BodyProp, Delete, Get, Middlewares, Path, Post, Put, Query, Route, Security, Tags, UploadedFile } from 'tsoa';
import { Crud } from '../../classes/Crud';
import { TestMiddleware } from '../../middleware/test-middleware';
import { ICreateResponse } from '../../types/api/ICreateResponse';
import { IIndexResponse } from '../../types/api/IIndexQuery';
import { IUpdateResponse } from '../../types/api/IUpdateResponse';
import { IPromo, IPromoCreate, IPromoUpdate } from '../../types/tables/promo/IPromo';

const READ_COLUMNS = ['promo_id', 'promo', 'user_id'];

/**
 * Une promo de la plateforme.
 */
@Route("/promo")
@Security('jwt')
@Middlewares(TestMiddleware)      // Exemple de l'ajout de middleware avant les sous-routes
@Tags('Promo')
export class PromoController {

  /**
   * Récupérer une page de promo.
   * 
   */
  @Get()
  public async getPromo( 
  ): Promise<IPromo[]> {    
    return [];
  }

  /**
   * Créer une nouvelle promo
   * 
   * @param body 
   */
  @Post()
  public async createPromo(
    @Body() body: IPromoCreate
  ): Promise<ICreateResponse> {
    return Crud.Create<IPromoCreate>(body, 'PROMOS');
  }

  /**
   * Mettre à jour une promo
   * 
   * @param id 
   * @param body 
   */
  @Put('{id}')
  public async updatePromo(
    @Path() id: number,
    @Body() body: IPromoUpdate
  ): Promise<IUpdateResponse> {
    return Crud.Update<IPromoUpdate>(body, 'PROMOS', 'promo_id', id);
  }

  /**
  * Supprimer une promo
  * @param id 
   * @param body 
  */
  @Delete('{id}')
  public async deletePromo(
    @Path() id: number,
  ): Promise<IUpdateResponse> {
    return Crud.Delete('PROMOS', 'promo_id', id);
  }

}