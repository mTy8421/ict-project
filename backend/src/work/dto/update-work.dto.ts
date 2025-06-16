import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkDto } from './create-work.dto';
import { IsObject } from 'class-validator';

export class UpdateWorkDto extends PartialType(CreateWorkDto) {
  @IsObject()
  title: string;

  @IsObject()
  decription: string;

  @IsObject()
  status: string;

  @IsObject()
  priority: string;

  @IsObject()
  dateTimeStart: string;

  @IsObject()
  dateTimeEnd: string;
}
