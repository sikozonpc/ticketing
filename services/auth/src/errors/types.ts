export type CommomError = { message: string; field?: string; };

export interface CommomErrorResponse {
  errors: CommomError[];
}
