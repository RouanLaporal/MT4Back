import { CrudOperations, CrudRouter } from '../classes/CrudRouter';
import { IChallengeCreate, IChallengeRO, IChallengeUpdate } from '../types/tables/challenge/IChallenge';
import { ChallengeCreateValidator, ChallengeUpdateValidator } from '../types/tables/challenge/challenge.validator';

export const ROUTES_CHALLENGE = CrudRouter<IChallengeRO, IChallengeCreate, IChallengeUpdate>({
    table: 'challenge',
    primaryKey: 'challengeId',
    operations: CrudOperations.Index | CrudOperations.Create | CrudOperations.Read | CrudOperations.Update | CrudOperations.Delete,
    readColumns: ['challengeId', 'name', 'status'],
    validators: {
      create: ChallengeCreateValidator,
      update: ChallengeUpdateValidator
    }
  });