import { Body, BodyProp, Delete, Get, Middlewares, Path, Post, Put, Query, Route, Security, Tags, UploadedFile } from 'tsoa';
import { Crud } from '../../classes/Crud';
import { ICreateResponse } from '../../types/api/ICreateResponse';
import { IIndexResponse } from '../../types/api/IIndexQuery';
import { IUpdateResponse } from '../../types/api/IUpdateResponse';
import { IChallenge, IChallengeCreate, IChallengeUpdate } from '../../types/tables/challenge/IChallenge';
import { IUserCreate, IUserUpdate } from '../../types/tables/user/IUser';
import { IInstanceRO } from '../../types/api/IInstance';

const READ_COLUMNS = ['challenge_id', 'challenge', 'is_active', 'user_id', 'promo_id'];

/**
 * Un challenge de la plateforme.
 */
@Route("/challenge")
// @Security('jwt')
@Tags('Challenge')
export class ChallengeController {

  /**
   * Récupérer une page de challenge.
   */
  @Get()
  public async getChallengesByUser(
    /** La page (zéro-index) à récupérer */
    @Query() page?: string,
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: string,
  ): Promise<IIndexResponse<IChallenge>> {
    return Crud.Index<IChallenge>({ page, limit }, 'CHALLENGES', READ_COLUMNS);
  }

  /**
   * Créer un nouveau challenge
   */
  @Post()
  public async createChallenge(
    @Body() body: IChallengeCreate
  ): Promise<ICreateResponse> {
    return Crud.Create<IChallengeCreate>(body, 'CHALLENGES');
  }

  /**
   * Inscription d'un étudiant à un challenge
   *  
   */
  @Post('/evaluation/authentification/{token}')
  public async signUpToChallenge(
    @Path() token: string,
    @Body() body: IUserCreate
  ): Promise<boolean> {
    return true;
  }

  /**
   * Désactivation d'un challenge par id de challenge
   * @param challenge_id 
   * 
   */
  @Put('/desactivation/{challenge_id}')
  public async desactivateChallenge(
    @Path() challenge_id: number
  ): Promise<number> {
    return 1;
  }

  /**
   * Vérification de données pour un utilisateur 
   * 
   * @param body 
   * @param token 
   */
  @Post('/evaluation/SGBDR/{token}')
  public async launchChallenge(
    @Body() body: IInstanceRO,
    @Path() token: string,
  ): Promise<string> {
    return 'Success';
  }

}
