import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'รอดำเนินการ' })
  status: string;

  @Column({ default: 'low' })
  priority: string;

  @Column()
  department: string;

  @Column({ type: 'date', nullable: true })
  dateTime: string;

  @ManyToOne(() => User, (user) => user.works)
  user: User;
}
