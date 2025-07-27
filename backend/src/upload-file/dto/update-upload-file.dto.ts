import { PartialType } from '@nestjs/mapped-types';
import { CreateUploadFileDto } from './create-upload-file.dto';
import { IsObject } from 'class-validator';

export class UpdateUploadFileDto extends PartialType(CreateUploadFileDto) {
  @IsObject()
  file_name: string;
}
