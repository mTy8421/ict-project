import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkDto } from './create-work.dto';
import { IsObject } from 'class-validator';

export class UpdateWorkDto extends PartialType(CreateWorkDto) {
  @IsObject()
  description: string;

  @IsObject()
  status: string;

  @IsObject()
  dateTimeNow: string;

  @IsObject()
  startTime: string;

  @IsObject()
  options: number;
}
