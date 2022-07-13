export interface IValidation {
    /** Code de validation */
    code: number;
    /** ID de l'utilisateur associé à la validation */
    user_id: number;
}

export type IValidationCreate = IValidation;
export type IValidationUpdate = Partial<IValidationCreate>;
export type IValidationRO = Readonly<IValidation>;