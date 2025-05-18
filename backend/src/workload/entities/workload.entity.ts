import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum WorkloadStatus {
  PENDING = 'รอดำเนินการ',
  IN_PROGRESS = 'กำลังดำเนินการ',
  COMPLETED = 'เสร็จสิ้น',
}

export enum WorkloadPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity()
export class Workload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  // @Column({
  //   type: 'enum',
  //   enum: WorkloadStatus,
  //   default: WorkloadStatus.PENDING,
  // })
  // status: WorkloadStatus;

  @Column({
    default: 'รอดำเนินการ',
  })
  status: string;

  // @Column({
  //   type: 'enum',
  //   enum: WorkloadPriority,
  //   default: WorkloadPriority.MEDIUM,
  // })
  // priority: WorkloadPriority;

  @Column({
    default: 'medium',
  })
  priority: string;

  @ManyToOne(() => User, (user) => user.workloads)
  assignedTo: User;

  @Column()
  department: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  end_date: Date;
}
