import { Injectable } from '@nestjs/common';
import { CreateUploadFileDto } from './dto/create-upload-file.dto';
import { UpdateUploadFileDto } from './dto/update-upload-file.dto';

import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

import { InjectRepository } from '@nestjs/typeorm';
import { UploadFile } from './entities/upload-file.entity';
import { Repository } from 'typeorm';
// import { Work } from 'src/work/entities/work.entity';

@Injectable()
export class UploadFileService {
  constructor(
    @InjectRepository(UploadFile)
    private upload_fileRepsitory: Repository<UploadFile>,
    // @InjectRepository(Work) private workRepository: Repository<Work>,
  ) {}

  create(createUploadFileDto: CreateUploadFileDto) {
    console.table(createUploadFileDto);
    return `This action adds a new uploadFile`;
  }

  findAll() {
    return `This action returns all uploadFile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uploadFile`;
  }

  update(id: number, updateUploadFileDto: UpdateUploadFileDto) {
    console.table(updateUploadFileDto);
    return `This action updates a #${id} uploadFile`;
  }

  async remove(id: number) {
    const filesToDelete = await this.upload_fileRepsitory.find({
      where: { work: { id: id } },
    });

    if (!filesToDelete || filesToDelete.length === 0) {
      return `No files found for work id ${id}`;
    }

    const uploadDir = path.join(__dirname, '..', '..', 'images');
    const deletedFileNames: string[] = [];
    const errors: string[] = [];

    for (const fileToDelete of filesToDelete) {
      const filePath = path.join(uploadDir, fileToDelete.file_name);

      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        await this.upload_fileRepsitory.delete(fileToDelete.id);
        deletedFileNames.push(fileToDelete.file_name);
      } catch (error) {
        console.error(`Error deleting file ${fileToDelete.file_name}:`, error);
        errors.push(fileToDelete.file_name);
      }
    }

    let message = '';
    if (deletedFileNames.length > 0) {
      message += `Deleted: ${deletedFileNames.join(', ')}. `;
    }
    if (errors.length > 0) {
      message += `Failed to delete: ${errors.join(', ')}.`;
    }

    if (message === '') {
      return 'No files were processed.';
    }

    return message.trim();
  }

  async showImages(id: number) {
    const findImages = await this.upload_fileRepsitory
      .createQueryBuilder('upload_file')
      .where(`workId = :id`, { id: id })
      .getMany();
    return findImages;
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    if (
      !file ||
      typeof file.originalname !== 'string' ||
      !Buffer.isBuffer(file.buffer)
    ) {
      throw new Error('Invalid file upload');
    }

    const uploadDir = path.join(__dirname, '..', '..', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const resizedFilename = `resized-${Date.now()}-${file.originalname}${path.extname(file.originalname)}`;
    const resizedFilePath = path.join(uploadDir, resizedFilename);

    try {
      await sharp(file.buffer)
        .resize(800)
        .jpeg({ quality: 70 })
        .png({ quality: 70 })
        .toFile(resizedFilePath);

      const newFile = await this.upload_fileRepsitory.save({
        file_name: resizedFilename,
      });

      return { success: true, data: newFile };
    } catch (error) {
      console.error(`Error processing file ${file.originalname}:`, error);
      return `Failed to upload ${file.originalname}.`;
    }
  }

  async uploadMultiFile(files: Express.Multer.File[]): Promise<string[]> {
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
