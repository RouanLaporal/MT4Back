import { CrudOperations, CrudRouter } from  "../classes/CrudRouter";
import { IParticipationCreate, IParticipationUpdate, IParticipationRO } from "../types/tables/participation/IParticipation";
import { ParticipationCreateValidator, ParticipationUpdateValidator } from "../types/tables/participation/participation.validator";

export const ROUTES_PARTICIPATION = CrudRouter<IParticipationRO, IParticipationCreate, IParticipationUpdate>({
    table: 'participation',
    primaryKey: 'participation_id',
    operations: CrudOperations.Index | CrudOperations.Create |CrudOperations.Read |CrudOperations.Update | CrudOperations.Delete,
    readColumns: ['user_id', 'challenge_id', 'promo_id', 'score'],
    validators: {
        create: ParticipationCreateValidator,
        update: ParticipationUpdateValidator
    }
});

// PEUT ETRE A SUPPRIMER !!!!!!!!!!!!!!