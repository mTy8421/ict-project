import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWorkDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  priority: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsString()
  dateTimeStart?: string;

  @IsNotEmpty()
  @IsString()
  dateTimeEnd: string;

  @IsNotEmpty()
  @IsNumber()
  user: number;
}
