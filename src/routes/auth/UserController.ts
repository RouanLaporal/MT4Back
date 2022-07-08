import { Body, Delete, Get, Middlewares, Path, Post, Put, Query, Route, Security } from 'tsoa';
import { Crud } from '../../classes/Crud';
import { TestMiddleware } from '../../middleware/test-middleware';
import { ICreateResponse } from '../../types/api/ICreateResponse';
import { IIndexResponse } from '../../types/api/IIndexQuery';
import { IUpdateResponse } from '../../types/api/IUpdateResponse';
import { IUser, IUserCreate, IUserUpdate } from '../../types/tables/user/IUser';

const READ_COLUMNS = ['user_id', 'email', 'first_name', 'last_name', 'password', 'avatar', 'is_valid', 'role_id'];

/**
 * Un utilisateur de la plateforme.
 */
@Route("/auth/user")
@Security('jwt')
@Middlewares(TestMiddleware)      // Exemple de l'ajout de middleware avant les sous-routes
export class UserController {

  /**
   * Récupérer une page d'utilisateurs.
   */
  @Get()
  public async getUsers(
    /** La page (zéro-index) à récupérer */
    @Query() page?: string,    
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: string,    
  ): Promise<IIndexResponse<IUser>> {    
    return Crud.Index<IUser>({ page, limit }, 'user', READ_COLUMNS);
  }

  /**
   * Créer un nouvel utilisateur
   */
  @Post()
  public async createUser(
    @Body() body: IUserCreate
  ): Promise<ICreateResponse> {
    return Crud.Create<IUserCreate>(body, 'user');
  }

  /**
   * Récupérer une utilisateur avec le ID passé dans le URL
   */
  @Get('{user_id}')
  public async readUser(
    @Path() user_id: number
  ): Promise<IUser> {
    return Crud.Read<IUser>('user', 'user_id', user_id, READ_COLUMNS);
  }

  /**
   * Mettre à jour un utilisateur avec le ID passé dans le URL
   */
  @Put('{user_id}')
  public async updateUser(
    @Path() user_id: number,
    @Body() body: IUserUpdate
  ): Promise<IUpdateResponse> {
    return Crud.Update<IUserUpdate>(body, 'user', 'user_id', user_id);
  }
  
  /**
   * Supprimer un utilisateur
   */
  @Delete('{user_id}')
  public async deleteUser(
    @Path() user_id: number,
  ): Promise<IUpdateResponse> {
    return Crud.Delete('user', 'user_id', user_id);
  }

}
