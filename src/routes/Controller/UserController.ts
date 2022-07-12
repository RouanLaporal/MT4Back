import { Body, Delete, Get, Middlewares, Path, Post, Put, Query, Route, Security, Tags } from 'tsoa';
import { Crud } from '../../classes/Crud';
import { TestMiddleware } from '../../middleware/test-middleware';
import { ICreateResponse } from '../../types/api/ICreateResponse';
import { IIndexResponse } from '../../types/api/IIndexQuery';
import { IUpdateResponse } from '../../types/api/IUpdateResponse';
import { IUser, IUserCreate, IUserUpdate } from '../../types/tables/user/IUser';
import { IChangePasswordUpdate } from '../../types/api/IChangePassword';

const READ_COLUMNS = ['user_id', 'email', 'first_name', 'last_name', 'password', 'avatar', 'is_valid', 'role_id'];

/**
 * Un utilisateur de la plateforme.
 */
@Route("/auth/user")
@Security('jwt')
@Middlewares(TestMiddleware)      // Exemple de l'ajout de middleware avant les sous-routes
@Tags('User')
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
    return Crud.Index<IUser>({ page, limit }, 'USERS', READ_COLUMNS);
  }

  /**
   * Créer un nouvel utilisateur
   */
  @Post()
  public async createUser(
    @Body() body: IUserCreate
  ): Promise<ICreateResponse> {
    return Crud.Create<IUserCreate>(body, 'USERS');
  }

  /**
   * Récupérer un utilisateur avec l'ID passé dans l'URL
   */
  @Get('{user_id}')
  public async readUser(
    @Path() user_id: number
  ): Promise<IUser> {
    return Crud.Read<IUser>('USERS', 'user_id', user_id, READ_COLUMNS);
  }

  /**
   * Mettre à jour un utilisateur avec le ID passé dans le URL
   */
  @Put('{user_id}')
  public async updateUser(
    @Path() user_id: number,
    @Body() body: IUserUpdate
  ): Promise<IUpdateResponse> {
    return Crud.Update<IUserUpdate>(body, 'USERS', 'user_id', user_id);
  }

  /**
   * Supprimer un utilisateur
   */
  @Delete('{user_id}')
  public async deleteUser(
    @Path() user_id: number,
  ): Promise<IUpdateResponse> {
    return Crud.Delete('USERS', 'user_id', user_id);
  }

  /**
   * Changement du mot de passe oublié d'un utilisateur 
   * @param email 
   * 
   */
  @Post('/forget-password')
  public async forgetPassword(
    @Query() email: string
  ): Promise<string> {
    return 'success';
  }

  /**
   * Réinitialisation du mot de passe d'un utilisateur avec son id
   * 
   * @param id 
   * @param body 
   * 
   */
  @Post('/reset-password/{id}')
  public async resetPassword(
    @Path() id: number,
    @Body() body:IUserUpdate
  ): Promise<string> {
    return 'Success';
  }

  @Put('change-password')
  public async changePassword(
    @Body() body: IChangePasswordUpdate
  ): Promise<boolean> {
    return true;
  }

}
