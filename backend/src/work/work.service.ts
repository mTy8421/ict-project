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
  ) { }

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
        dateTimeNow:
          new Date().getFullYear().toString() +
          '-' +
          (new Date().getMonth() + 1).toString() +
          '-' +
          new Date().getDate().toString(),
        startTime: createWorkDto.startTime,
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
      .orderBy('work.dateTimeNow', 'DESC')
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

  async update(
    id: number,
    updateWorkDto: UpdateWorkDto,
    files?: Express.Multer.File[],
  ) {
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
        startTime: updateWorkDto.startTime,
        // options: option,
      })
      .where('id = :id', { id })
      .execute();

    if (files && files.length > 0) {
      await this.uploadMultiFile(files, id);
    }

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
      .orderBy('work.dateTimeNow', 'DESC')
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
      .orderBy('work.dateTimeNow', 'DESC')
      .innerJoinAndSelect('work.options', 'option')
      .innerJoinAndSelect('work.user', 'user')
      .where(
        'user.user_role != :user_role AND user.user_role NOT LIKE "พนักงาน%"',
        { user_role: 'หัวหน้าสำนักงาน' },
      )
      .getMany();
    return works;
  }

  findAllByUserRole(role: string) {
    const works = this.workRepository
      .createQueryBuilder('work')
      .orderBy('work.dateTimeNow', 'DESC')
      .innerJoinAndSelect('work.options', 'option')
      .innerJoinAndSelect('work.user', 'user')
      .where('user.user_role = :user_role', {
        user_role: role,
      })
      .getMany();
    return works;
  }

  // File Upload Function
  async uploadMultiFile(files: Express.Multer.File[], workID: number) {
    if (!files || files.length === 0) {
      throw new Error('No files were uploaded.');
    }

    const uploadDir = path.join(__dirname, '..', '..', 'images');
    const uploadDirPdfs = path.join(__dirname, '..', '..', 'pdfs');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (!fs.existsSync(uploadDirPdfs)) {
      fs.mkdirSync(uploadDirPdfs, { recursive: true });
    }

    const promises = files.map(async (file) => {
      if (
        !file ||
        typeof file.originalname !== 'string' ||
        !Buffer.isBuffer(file.buffer)
      ) {
        return `Invalid data for file: ${file?.originalname || 'unknown'}`;
      }

      const originalname = Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
      );

      // const resizedFilename = `resized-${Date.now()}-${originalname}`;
      const resizedFilename = `${Date.now()}-${originalname}`;
      const isPdf = path.extname(originalname).toLowerCase() === '.pdf';
      const resizedFilePath = isPdf
        ? path.join(uploadDirPdfs, resizedFilename)
        : path.join(uploadDir, resizedFilename);

      try {
        if (isPdf) {
          // For PDF files, save directly without processing
          await fs.promises.writeFile(resizedFilePath, file.buffer);
        } else {
          // For image files, process with Sharp
          await sharp(file.buffer)
            .resize(800)
            .jpeg({ quality: 70 })
            .png({ quality: 70 })
            .toFile(resizedFilePath);
        }

        // This is Function Upload File
        await this.upload_fileRepsitory
          .createQueryBuilder('upload_file')
          .insert()
          .into(UploadFile)
          .values({
            work: { id: workID },
            file_name: resizedFilename,
          })
          .execute();

        return `File ${originalname} uploaded successfully as ${resizedFilename}`;
      } catch (error) {
        console.error(`Error processing file ${originalname}:`, error);
        return `Failed to upload ${originalname}.`;
      }
    });

    return Promise.all(promises);
  }
}
