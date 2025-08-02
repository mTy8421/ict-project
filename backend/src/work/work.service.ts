import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Work } from './entities/work.entity';
import { User } from 'src/user/entities/user.entity';
import { Option } from 'src/option/entities/option.entity';
import { UploadFile } from 'src/upload-file/entities/upload-file.entity';

import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work) private workRepository: Repository<Work>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Option) private optionRepsitory: Repository<Option>,
    @InjectRepository(UploadFile)
    private upload_fileRepsitory: Repository<UploadFile>,
  ) {}

  async create(createWorkDto: CreateWorkDto, files: Express.Multer.File[]) {
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

    if (files && files.length > 0) {
      const workId = works.identifiers[0].id as number;
      await this.uploadMultiFile(files, workId);
    }

    return works;
  }

  findAll() {
    const works = this.workRepository
      .createQueryBuilder('work')
      .innerJoinAndSelect('work.options', 'option')
      .innerJoinAndSelect('work.user', 'user')
      .getMany();
    return works;
  }

  async findOne(id: number) {
    const works = await this.workRepository
      .createQueryBuilder('work')
      .innerJoinAndSelect('work.options', 'option')
      .where('work.id = :id', { id })
      .getOne();
    if (!works) {
      throw new NotFoundException(`User ID Note Found`);
    }

    return works;
  }

  async update(id: number, updateWorkDto: UpdateWorkDto) {
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
        description: updateWorkDto.description,
        dateTimeStart: updateWorkDto.dateTimeStart,
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
      .innerJoinAndSelect('work.user', 'user')
      .innerJoinAndSelect('work.options', 'option')
      .where('user.user_id = :userId', { userId })
      .getMany();

    if (!works) {
      throw new NotFoundException(`User ID Not Found`);
    }
    return works;
  }

  findAllUser() {
    const works = this.workRepository
      .createQueryBuilder('work')
      .innerJoinAndSelect('work.options', 'option')
      .innerJoinAndSelect('work.user', 'user')
      .where('user.user_role != :user_role', { user_role: 'หัวหน้าสำนักงาน' })
      .getMany();
    return works;
  }

  async uploadMultiFile(files: Express.Multer.File[], workID: number) {
    if (!files || files.length === 0) {
      throw new Error('No files were uploaded.');
    }

    const uploadDir = path.join(__dirname, '..', '..', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const promises = files.map(async (file) => {
      if (
        !file ||
        typeof file.originalname !== 'string' ||
        !Buffer.isBuffer(file.buffer)
      ) {
        return `Invalid data for file: ${file?.originalname || 'unknown'}`;
      }

      const resizedFilename = `resized-${Date.now()}-${file.originalname}${path.extname(file.originalname)}`;
      const resizedFilePath = path.join(uploadDir, resizedFilename);

      try {
        await sharp(file.buffer)
          .resize(800)
          .jpeg({ quality: 70 })
          .png({ quality: 70 })
          .toFile(resizedFilePath);

        const UploadFiles = await this.upload_fileRepsitory
          .createQueryBuilder('upload_file')
          .insert()
          .into(UploadFile)
          .values({
            work: { id: workID },
            file_name: resizedFilename,
          })
          .execute();

        console.log(UploadFiles);
        return `File ${file.originalname} uploaded successfully as ${resizedFilename}`;
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        return `Failed to upload ${file.originalname}.`;
      }
    });

    return Promise.all(promises);
  }
}
