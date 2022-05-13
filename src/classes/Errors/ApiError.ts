import { ErrorCode } from './ErrorCode';
import { StructuredErrors } from './StructuredErrors';
import { IApiError } from '../../types/api/IApiError';


export class ApiError {
  constructor(private httpCode: ErrorCode, private structuredError: StructuredErrors, private errMessage: string, private errDetails?: any) {
  }

  get json(): IApiError {
    return {
      code: this.httpCode,
      structured: this.structuredError,
      message: this.message,
      details: this.details
    }
  }

  get code() {
    return this.httpCode;
  }

  set code(val: ErrorCode) {
    this.httpCode = val;
  }

  get structured() {
    return this.structuredError;
  }

  set structured(val: StructuredErrors) {
    this.structuredError = val;
  }

  set message(msg: string) {
    this.errMessage = msg;
  }

  get message() {
    return this.errMessage;
  }

  set details(val: any) {
    this.errDetails = val;
  }

  get details() {
    return this.errDetails;
  }
}
