import { Option } from 'src/option/entities/option.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UploadFile } from 'src/upload-file/entities/upload-file.entity';

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
  dateTimeNow: string;

  @Column({ type: 'time', nullable: true })
  startTime: string;
  
  @ManyToOne(() => User, (user) => user.works)
  user: User;

  @ManyToOne(() => Option, (optins) => optins.works)
  options: Option;

  @OneToMany(() => UploadFile, (uploadFile) => uploadFile.work)
  uploadFile: UploadFile[];
}
