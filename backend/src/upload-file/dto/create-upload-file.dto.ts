import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUploadFileDto {
  @IsNotEmpty()
  @IsNumber()
  work: number;

  @IsNotEmpty()
  @IsString()
  file_name: string;
}
