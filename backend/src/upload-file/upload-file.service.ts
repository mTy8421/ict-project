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

  remove(id: number) {
    return `This action removes a #${id} uploadFile`;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (
      !file ||
      typeof file.originalname !== 'string' ||
      !Buffer.isBuffer(file.buffer)
    ) {
      throw new Error('Invalid file upload');
    }

    // Here you can implement your file handling logic, e.g., save file info to DB
    // For demonstration, just return the original filename
    await Promise.resolve(); // Dummy await to satisfy async
    const uploadDir = path.join(__dirname, '..', '..', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    // Resize and compress the image using sharp

    const resizedFilePath = path.join(
      uploadDir,
      `resized-${file.originalname}`,
    );
    await sharp(file.buffer)
      .resize(800) // Resize width to 800px, auto height
      .jpeg({ quality: 70 }) // Compress to 70% quality JPEG
      .png({ quality: 70 }) // Compress to 70% quality PNG
      .toFile(resizedFilePath);

    // Remove the original uploaded file after resizing
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return `File ${file && file.originalname ? file.originalname : 'unknown'} uploaded successfully`;
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

      const resizedFilename = `resized-${Date.now()}-${file.originalname}`;
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
