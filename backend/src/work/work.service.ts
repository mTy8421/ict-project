import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Work } from './entities/work.entity';
import { User } from 'src/user/entities/user.entity';
import { Option } from 'src/option/entities/option.entity';

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work) private workRepository: Repository<Work>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Option) private optionRepsitory: Repository<Option>,
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

    const option = await this.optionRepsitory.findOne({
      where: { id: createWorkDto.options },
    });

    if (!option) {
      throw new NotFoundException(
        `Option with ID ${createWorkDto.options} Not found`,
      );
    }

    const works = await this.workRepository
      .createQueryBuilder('work')
      .insert()
      .into(Work)
      .values({
        description: createWorkDto.description,
        status: createWorkDto.status,
        department: createWorkDto.department,
        dateTimeStart: createWorkDto.dateTimeStart,
        dateTimeEnd: createWorkDto.dateTimeEnd,
        user: user ?? undefined,
        options: option ?? undefined,
      })
      .execute();
    return works;
  }

  findAll() {
    const works = this.workRepository
      .createQueryBuilder('work')
      .innerJoin('work.options', 'option')
      .getMany();
    return works;
  }

  async findOne(id: number) {
    const works = await this.workRepository
      .createQueryBuilder('work')
      .innerJoin('work.options', 'option')
      .where('work.id = :id', { id })
      .getOne();
    if (!works) {
      throw new NotFoundException(`User ID Note Found`);
    }
    return works;
  }

  async update(id: number, updateWorkDto: UpdateWorkDto) {
    const setDate = new Date();

    const option = await this.optionRepsitory.findOne({
      where: { id: updateWorkDto.options },
    });

    if (!option) {
      throw new NotFoundException(
        `Option with ID ${updateWorkDto.options} Not found`,
      );
    }

    const works = await this.workRepository
      .createQueryBuilder('work')
      .update(Work)
      .set({
        status: updateWorkDto.status,
        department: updateWorkDto.department,
        dateTimeStart: `${setDate.getFullYear()}-${setDate.getMonth() + 1}-${setDate.getDate()}`,
        dateTimeEnd: updateWorkDto.dateTimeEnd,
        options: option,
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
      .innerJoin('work.options', 'option')
      .where('user.user_id = :userId', { userId })
      .getMany();

    if (!works) {
      throw new NotFoundException(`User ID Not Found`);
    }
    return works;
  }
}
