import { Body, BodyProp, Delete, Get, Middlewares, Path, Post, Put, Query, Route, Security, Tags, UploadedFile } from 'tsoa';
import { Crud } from '../../classes/Crud';
import { IUpdateResponse } from '../../types/api/IUpdateResponse';
import { IPromoCreate, IPromoUpdate } from '../../types/tables/promo/IPromo';
import { authorization } from '../../middleware/authorization';
import { Promo } from '../../classes/Promo';

const READ_COLUMNS = ['promo_id', 'promo', 'user_id'];

/**
 * Une promo de la plateforme.
 */
@Route("/promo")
// @Security('jwt')
@Tags('Promo')
export class PromoController {

  /**
   * Récupérer une page de promo.
   * 
   */
  @Get()
  @Middlewares(authorization('professor'))
  public async getPromo(
    @Query('page') page: number,
    @Query('limit') limit: number
  ): Promise<any> {
    return new Promo().getPromo(page, limit, 15)
  }

  /**
   * Créer une nouvelle promo
   * 
   * @param body 
   */
  @Post()
  @Middlewares(authorization('professor'))
  public async createPromo(
    @Body() body: IPromoCreate
  ): Promise<any> {
    return new Promo().createPromo(body)
  }

  /**
   * Mettre à jour une promo
   * 
   * @param id 
   * @param body 
   */
  @Put('{id}')
  @Middlewares(authorization('professor'))
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
  @Middlewares(authorization('professor'))
  public async deletePromo(
    @Path() id: number,
  ): Promise<IUpdateResponse> {
    return Crud.Delete('PROMOS', 'promo_id', id);
  }

}