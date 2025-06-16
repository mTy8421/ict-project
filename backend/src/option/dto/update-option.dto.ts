import { PartialType } from '@nestjs/mapped-types';
import { CreateOptionDto } from './create-option.dto';
import { IsObject } from 'class-validator';

export class UpdateOptionDto extends PartialType(CreateOptionDto) {
  @IsObject()
  title: string;

  @IsObject()
  priority: string;
}
