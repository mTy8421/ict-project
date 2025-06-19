import { Option } from 'src/option/entities/option.entity';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'pending' })
  status: string;

  @Column()
  department: string;

  @Column({ type: 'date', nullable: true })
  dateTimeStart: string;

  @Column({ type: 'date', nullable: true })
  dateTimeEnd: string;

  @ManyToOne(() => User, (user) => user.works)
  user: User;

  @ManyToOne(() => Option, (optins) => optins.works)
  options: Option;
}
