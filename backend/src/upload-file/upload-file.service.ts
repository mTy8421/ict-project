import { Injectable } from '@nestjs/common';
import { CreateUploadFileDto } from './dto/create-upload-file.dto';
import { UpdateUploadFileDto } from './dto/update-upload-file.dto';

import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class UploadFileService {
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
      .toFile(resizedFilePath);

    // Remove the original uploaded file after resizing
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return `File ${file && file.originalname ? file.originalname : 'unknown'} uploaded successfully`;
  }
}
