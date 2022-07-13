import { Body, Delete, Get, Middlewares, Path, Post, Put, Query, Response, Route, Security, Tags, UploadedFile, SuccessResponse, Controller } from 'tsoa';
import { Crud } from '../../classes/Crud';
import { User } from '../../classes/User';
import { ICreateResponse } from '../../types/api/ICreateResponse';
import { IIndexResponse } from '../../types/api/IIndexQuery';
import { IUpdateResponse } from '../../types/api/IUpdateResponse';
import { IUser, IUserCreate, IUserUpdate, IUserRO } from '../../types/tables/user/IUser';
import { IChangePasswordUpdate } from '../../types/api/IChangePassword';
import { response, request } from 'express';
import { IValidationCreate } from '../../types/tables/validation/IValidation';
import { expressAuthentication } from '../auth/authentication';
import { validationPassword, validationEmail } from '../../middleware/validForm';
import { authorization } from '../../middleware/authorization';
const jwt = require('jsonwebtoken');
const fs = require('fs');



const READ_COLUMNS = ['user_id', 'email', 'first_name', 'last_name', 'password', 'avatar', 'is_valid', 'role_id'];

/**
 * Un utilisateur de la plateforme.
 */
@Route("/auth/user")
@Tags('User')
export class UserController extends Controller {

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
  @Middlewares(validationPassword())
  @Middlewares(validationEmail())
  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(
    @Body() body: Omit<IUserCreate, 'role_id'>,
  ): Promise<ICreateResponse> {
    this.setStatus(200); // set return status 201
    return new User().register(body);
  }
  @Middlewares(authorization('professor'))
  @Post('/verification-code')
  public async verificationCode(
    @Body() body: IValidationCreate,

  ): Promise<any> {
    this.setStatus(200); // set return status 201
    return new User().verificationCode(body.code, body.user_id);
  }


  /**
   * Changement du mot de passe oublié d'un utilisateur 
   * @param email 
   * 
   */
  @Middlewares(validationEmail())
  @Post('/forget-password')
  public async forgetPassword(
    @Body() body: IUserUpdate
  ): Promise<any> {
    return new User().forgetPassword(body);
  }

  /**
  * Réinitialisation du mot de passe d'un utilisateur avec son id
  * 
  * @param id 
  * @param body 
  * 
  */
  @Middlewares(validationPassword())
  @Post('/reset-password/{id}')
  public async resetPassword(
    @Path() id: number,
    @Body() body: IUserUpdate
  ): Promise<any> {
    return new User().resetPassword(body, id);
  }
  /**
   *Authentifie un utilisateur
   */
  @Middlewares(validationPassword())
  @Middlewares(validationEmail())
  @Post('/login')
  public async Login(
    @Body() body: IUserUpdate
  ): Promise<any> {
    return new User().Login(body)
  }
  /**
   * 
   * @param body request body from user
   * @returns 
   */
  @Middlewares(authorization('professor'))
  @Middlewares(validationPassword())
  @Middlewares(validationEmail())
  @Put('change-password')
  public async changePassword(
    @Body() body: IChangePasswordUpdate
  ): Promise<any> {
    return new User().changePassword(body);
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

}
