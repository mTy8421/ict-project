import { Work } from 'src/work/entities/work.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'low' })
  priority: string;

  @OneToMany(() => Work, (works) => works.options)
  works: Work[];
}
