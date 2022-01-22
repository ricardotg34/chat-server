export class ResponseDto<T = any> {
  statusCode: number;
  message: string;
  data: T;

  constructor(statusCode: number);
  constructor(statusCode: number, data: T);
  constructor(statusCode: number, message: string);
  constructor(statusCode: number, data: T, message: string);

  constructor(
    statusCode: number,
    dataOrMessage?: string | T,
    message?: string
  ) {
    this.statusCode = statusCode;
    if (typeof dataOrMessage === 'string') {
      this.message = dataOrMessage;
    } else {
      this.data = dataOrMessage;
      this.message = !!message ? message : 'Data found';
    }
  }
}
