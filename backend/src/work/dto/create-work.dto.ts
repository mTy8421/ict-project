import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWorkDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  decription: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  priority: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsString()
  dateTime: string;

  @IsNotEmpty()
  @IsNumber()
  user: number;
}
