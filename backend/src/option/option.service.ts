import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option) private optionRepository: Repository<Option>,
  ) {}
  async create(createOptionDto: CreateOptionDto) {
    const options = await this.optionRepository
      .createQueryBuilder('option')
      .insert()
      .into(Option)
      .values({
        title: createOptionDto.title,
        priority: createOptionDto.priority,
      })
      .execute();
    return options;
  }

  findAll() {
    const options = this.optionRepository
      .createQueryBuilder('option')
      .getMany();
    return options;
  }

  findOne(id: number) {
    const options = this.optionRepository
      .createQueryBuilder('option')
      .where('id = :id', { id })
      .getOne();
    return options;
  }

  async update(id: number, updateOptionDto: UpdateOptionDto) {
    const options = await this.optionRepository
      .createQueryBuilder('option')
      .update(Option)
      .set({
        title: updateOptionDto.title,
        priority: updateOptionDto.priority,
      })
      .where('id = :id', { id })
      .execute();
    return options;
  }

  async remove(id: number) {
    const options = await this.optionRepository
      .createQueryBuilder('option')
      .delete()
      .from(Option)
      .where('id = :id', { id })
      .execute();
    return options;
  }
}
