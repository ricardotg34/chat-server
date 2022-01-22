import { Type } from '@nestjs/common';
import { getSchemaPath } from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ResponseDto } from '../dto/response.dto';

export class ResponseDtoSchema<D> implements SchemaObject {
  dataObject: Type<D>;
  allOf: (SchemaObject | ReferenceObject)[];
  constructor(dataObject?: Type<D>) {
    this.dataObject = dataObject;
    this.allOf = [
      { $ref: getSchemaPath(ResponseDto) },
      dataObject
        ? {
            properties: {
              data: {
                $ref: getSchemaPath(dataObject)
              }
            }
          }
        : {}
    ];
  }
}
