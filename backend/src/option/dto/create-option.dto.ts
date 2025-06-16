import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOptionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  priority: string;

  @IsNotEmpty()
  @IsNumber()
  works: number;
}
