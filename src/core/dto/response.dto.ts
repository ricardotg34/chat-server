import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T = any> {
  @ApiProperty({
    description: 'Status code',
    example: 200,
    type: Number
  })
  statusCode: number;
  @ApiProperty({
    description: 'Status code',
    example: 'Example message',
    type: String
  })
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
