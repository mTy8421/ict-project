import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { WorkloadStatus } from '../entities/workload.entity';

export class CreateWorkloadDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(WorkloadStatus)
  status: WorkloadStatus;

  @IsNumber()
  @IsNotEmpty()
  assignedToId: number;

  @IsString()
  @IsNotEmpty()
  department: string;
} 