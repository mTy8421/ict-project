import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUploadFileDto {
  @IsNotEmpty()
  @IsString()
  file_name: string;
}
