import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workload, WorkloadStatus } from './entities/workload.entity';
import { CreateWorkloadDto } from './dto/create-workload.dto';
import { User } from '../user/entities/user.entity';

interface DepartmentStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface WorkloadStats {
  department: string;
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

@Injectable()
export class WorkloadService {
  constructor(
    @InjectRepository(Workload)
    private workloadRepository: Repository<Workload>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createWorkloadDto: CreateWorkloadDto): Promise<Workload> {
    const user = await this.userRepository.findOneBy({
      user_id: createWorkloadDto.assignedToId,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const workload = this.workloadRepository.create({
      ...createWorkloadDto,
      assignedTo: user,
      start_date: createWorkloadDto.start_date,
      end_date: createWorkloadDto.end_date,
    });

    return this.workloadRepository.save(workload);
  }

  async findAll(): Promise<Workload[]> {
    return this.workloadRepository.find({
      relations: ['assignedTo'],
    });
  }

  async findByDepartment(department: string): Promise<Workload[]> {
    return this.workloadRepository.find({
      where: { department },
      relations: ['assignedTo'],
    });
  }

  async findByUser(userId: number): Promise<Workload[]> {
    return this.workloadRepository.find({
      where: { assignedTo: { user_id: userId } },
      relations: ['assignedTo'],
    });
  }

  async updateStatus(id: number, status: WorkloadStatus): Promise<Workload> {
    const workload = await this.workloadRepository.findOneBy({ id });
    if (!workload) {
      throw new NotFoundException('Workload not found');
    }

    workload.status = status;
    return this.workloadRepository.save(workload);
  }

  async update(
    id: number,
    updateWorkloadDto: Partial<CreateWorkloadDto>,
  ): Promise<Workload> {
    const workload = await this.workloadRepository.findOne({
      where: { id },
      relations: ['assignedTo'],
    });
    if (!workload) {
      throw new NotFoundException('Workload not found');
    }

    // If assignedToId is provided, update the assigned user
    if (updateWorkloadDto.assignedToId) {
      const user = await this.userRepository.findOneBy({
        user_id: updateWorkloadDto.assignedToId,
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      workload.assignedTo = user;
    }

    // Update other fields
    Object.assign(workload, updateWorkloadDto);

    return this.workloadRepository.save(workload);
  }

  async remove(id: number): Promise<void> {
    const result = await this.workloadRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Workload not found');
    }
  }

  // New methods for graph data
  async getWorkloadStatsByDepartment(): Promise<WorkloadStats[]> {
    const workloads = await this.workloadRepository.find({
      relations: ['assignedTo'],
    });

    const stats = workloads.reduce<Record<string, DepartmentStats>>(
      (acc, workload) => {
        const dept = workload.department;
        if (!acc[dept]) {
          acc[dept] = {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
          };
        }
        acc[dept].total++;
        switch (workload.status) {
          case WorkloadStatus.PENDING:
            acc[dept].pending++;
            break;
          case WorkloadStatus.IN_PROGRESS:
            acc[dept].inProgress++;
            break;
          case WorkloadStatus.COMPLETED:
            acc[dept].completed++;
            break;
        }
        return acc;
      },
      {},
    );

    return Object.entries(stats).map(([department, data]) => ({
      department,
      total: data.total,
      pending: data.pending,
      inProgress: data.inProgress,
      completed: data.completed,
    }));
  }

  async getWorkloadStatsByUser(userId: number): Promise<WorkloadStats> {
    const workloads = await this.findByUser(userId);
    return {
      department: 'user',
      total: workloads.length,
      pending: workloads.filter((w) => w.status === WorkloadStatus.PENDING)
        .length,
      inProgress: workloads.filter(
        (w) => w.status === WorkloadStatus.IN_PROGRESS,
      ).length,
      completed: workloads.filter((w) => w.status === WorkloadStatus.COMPLETED)
        .length,
    };
  }

  async searchByName(name: string): Promise<Workload[]> {
    return this.workloadRepository
      .createQueryBuilder('workload')
      .leftJoinAndSelect('workload.assignedTo', 'user')
      .where('user.user_name LIKE :name', { name: `%${name}%` })
      .getMany();
  }

  async findOneById(id: number): Promise<Workload> {
    const workload = await this.workloadRepository.findOne({
      where: { id },
      relations: ['assignedTo'],
    });
    if (!workload) {
      throw new NotFoundException('Workload not found');
    }
    return workload;
  }

  async findeOneByUser(user_id: number): Promise<Workload[]> {
    const workload = await this.workloadRepository
      .createQueryBuilder('workload')
      .innerJoin('workload.assignedTo', 'user')
      .where('user.user_id = :user_id', { user_id })
      .getMany();

    if (!workload) {
      throw new NotFoundException('Workload not found for user');
    }

    return workload;
  }
}
