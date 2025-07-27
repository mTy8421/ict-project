import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkDto } from './create-work.dto';
import { IsObject } from 'class-validator';

export class UpdateWorkDto extends PartialType(CreateWorkDto) {
  @IsObject()
  description: string;

  @IsObject()
  status: string;

  @IsObject()
  dateTimeStart: string;

  @IsObject()
  dateTimeEnd: string;

  @IsObject()
  options: number;

  @IsObject()
  uploadFile: number;
}
