import { Module } from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { UploadFileController } from './upload-file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadFile } from './entities/upload-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UploadFile])],
  controllers: [UploadFileController],
  providers: [UploadFileService],
})
export class UploadFileModule { }
