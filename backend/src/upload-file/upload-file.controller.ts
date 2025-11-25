import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { UploadFileService } from './upload-file.service';
import { CreateUploadFileDto } from './dto/create-upload-file.dto';
import { UpdateUploadFileDto } from './dto/update-upload-file.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('upload-file')
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService) {}


  @Post('upload')
  @UseInterceptors(FileInterceptor('fileUpload'))
  uploadMapFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadFileService.uploadFile(file);
  }

  @Post('multi')
  @UseInterceptors(FilesInterceptor('fileUpload'))
  uploadMapFileMulti(@UploadedFiles() files: Express.Multer.File[]) {
    return this.uploadFileService.uploadMultiFile(files);
  }

  @Post('pdf')
  @UseInterceptors(FileInterceptor('fileUpload'))
  uploadPdfFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadFileService.uploadPdfFile(file);
  }

  @Get('show/:filename')
  showFileName(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: 'images' });
  }

  @Get('showPdf/:filename')
  showPdfFileName(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: 'pdfs' });
  }

  @Get('show/id/:id')
  show(@Param('id') id: string) {
    return this.uploadFileService.showImages(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadFileService.remove(+id);
  }

  @Delete('file/:id')
  removeFile(@Param('id') id: string) {
    return this.uploadFileService.removeFile(+id);
  }
}
