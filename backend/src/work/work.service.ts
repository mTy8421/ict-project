import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Work } from './entities/work.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work) private workRepository: Repository<Work>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createWorkDto: CreateWorkDto) {
    const user = await this.userRepository.findOne({
      where: { user_id: createWorkDto.user },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createWorkDto.user} not found`,
      );
    }

    const works = await this.workRepository
      .createQueryBuilder('work')
      .insert()
      .into(Work)
      .values({
        title: createWorkDto.title,
        description: createWorkDto.decription,
        status: createWorkDto.status,
        priority: createWorkDto.priority,
        department: createWorkDto.department,
        dateTime: createWorkDto.dateTime,
        user: user ?? undefined,
      })
      .execute();

    return works;
  }

  findAll() {
    const works = this.workRepository.createQueryBuilder('work').getMany();
    return works;
  }

  async findOne(id: number) {
    const works = await this.workRepository
      .createQueryBuilder('work')
      .where('work.id = :id', { id })
      .getOne();
    if (!works) {
      throw new NotFoundException(`User ID Note Found`);
    }
    return works;
  }

  async update(id: number, updateWorkDto: UpdateWorkDto) {
    const works = await this.workRepository
      .createQueryBuilder('work')
      .update(Work)
      .set({
        title: updateWorkDto.title,
        status: updateWorkDto.status,
        priority: updateWorkDto.priority,
        department: updateWorkDto.department,
        dateTime: updateWorkDto.dateTime,
      })
      .where('id = :id', { id })
      .execute();
    return works;
  }

  async remove(id: number) {
    const works = await this.workRepository
      .createQueryBuilder('work')
      .delete()
      .from(Work)
      .where('id = :id', { id })
      .execute();
    return works;
  }

  async findByUser(userId: number) {
    const works = await this.workRepository
      .createQueryBuilder('work')
      .innerJoin('work.user', 'user')
      .where('user.user_id = :user_id', { userId })
      .getMany();

    if (!works) {
      throw new NotFoundException(`User ID Not Found`);
    }

    return works;
  }
}
