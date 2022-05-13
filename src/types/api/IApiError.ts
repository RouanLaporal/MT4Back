import { ErrorCode } from '../../classes/Errors/ErrorCode';
import { StructuredErrors } from '../../classes/Errors/StructuredErrors';

export interface IApiError {
  code: ErrorCode,
  structured: StructuredErrors,
  message?: string,
  details?: any,
}