import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';
import { Repository } from 'typeorm';
import { Work } from 'src/work/entities/work.entity';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option) private optionRepository: Repository<Option>,
    @InjectRepository(Work) private workRepository: Repository<Work>,
  ) {}
  async create(createOptionDto: CreateOptionDto) {
    const work = await this.workRepository.findOne({
      where: { id: createOptionDto.works },
    });

    if (!work) {
      throw new NotFoundException(
        `Work with ID ${createOptionDto.works} not found`,
      );
    }

    const options = await this.optionRepository
      .createQueryBuilder('option')
      .insert()
      .into(Option)
      .values({
        title: createOptionDto.title,
        priority: createOptionDto.priority,
        works: work ?? undefined,
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
      .where('option.id = :id', { id })
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
      .where('optin.id = :id', { id })
      .execute();
    return options;
  }

  async remove(id: number) {
    const options = await this.optionRepository
      .createQueryBuilder('option')
      .delete()
      .from(Option)
      .where('option.id = :id', { id })
      .execute();
    return options;
  }
}
