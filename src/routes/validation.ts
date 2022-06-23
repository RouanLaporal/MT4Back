import { CrudOperations, CrudRouter } from  "../classes/CrudRouter";
import { IValidationCreate, IValidationUpdate, IValidationRO } from "../types/tables/validation/IValidation";
import { ValidationCreateValidator, ValidationUpdateValidator } from "../types/tables/validation/validation.validator";

export const ROUTES_VALIDATION = CrudRouter<IValidationRO, IValidationCreate, IValidationUpdate>({
    table: 'validation',
    primaryKey: 'validation_id',
    operations: CrudOperations.Index | CrudOperations.Create |CrudOperations.Read |CrudOperations.Update | CrudOperations.Delete,
    readColumns: ['validation_id', 'code', 'user_id'],
    validators: {
        create: ValidationCreateValidator,
        update: ValidationUpdateValidator
    }
});