import { IsString, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { WorkloadStatus, WorkloadPriority } from '../entities/workload.entity';

export class CreateWorkloadDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(WorkloadStatus)
  status: WorkloadStatus;

  @IsEnum(WorkloadPriority)
  priority: WorkloadPriority;

  @IsNumber()
  @IsNotEmpty()
  assignedToId: number;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  start_date?: string;

  @IsString()
  end_date?: string;
} 