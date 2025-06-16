import { Work } from 'src/work/entities/work.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'low' })
  priority: string;

  @OneToOne(() => Work, (works) => works.options)
  works: Work;
}
