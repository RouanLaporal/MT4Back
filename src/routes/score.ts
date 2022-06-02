import { CrudOperations, CrudRouter } from  "../classes/CrudRouter";
import { IScoreCreate, IScoreUpdate, IScoreRO } from "../types/tables/score/IScore";
import { ScoreCreateValidator, ScoreUpdateValidator } from "../types/tables/score/score.validator";

export const ROUTES_SCORE = CrudRouter<IScoreRO, IScoreCreate, IScoreUpdate>({
    table: 'score',
    primaryKey: 'scoreId',
    operations: CrudOperations.Index | CrudOperations.Create |CrudOperations.Read |CrudOperations.Update | CrudOperations.Delete,
    readColumns: ['scoreId', 'nbScore'],
    validators: {
        create: ScoreCreateValidator,
        update: ScoreUpdateValidator
    }
});