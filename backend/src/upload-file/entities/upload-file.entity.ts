import { Work } from 'src/work/entities/work.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class UploadFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file_name: string;

  @ManyToOne(() => Work, (work) => work.uploadFile)
  work: Work;
}
