export interface IValidation {
    /** ID de validation */
    validation_id: number;
    /** Code de validation */
    code: number;
    /** ID de l'utilisateur associé à la validation */
    user_id: number;
}

export type IValidationCreate = Omit<IValidation, 'validation_id'>;
export type IValidationUpdate = Partial<IValidationCreate>;
export type IValidationRO = Readonly<IValidation>;