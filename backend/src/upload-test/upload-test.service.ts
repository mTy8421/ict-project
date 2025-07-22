import { Injectable } from '@nestjs/common';
import { CreateUploadTestDto } from './dto/create-upload-test.dto';
import { UpdateUploadTestDto } from './dto/update-upload-test.dto';

// import { File as MulterFile } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class UploadTestService {
  create(createUploadTestDto: CreateUploadTestDto) {
    return 'This action adds a new uploadTest';
  }

  findAll() {
    return `This action returns all uploadTest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} uploadTest`;
  }

  update(id: number, updateUploadTestDto: UpdateUploadTestDto) {
    return `This action updates a #${id} uploadTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} uploadTest`;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (
      !file ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      typeof (file as Express.Multer.File).originalname !== 'string' ||
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      !Buffer.isBuffer(typeof (file as Express.Multer.File).buffer)
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
