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



  @Get('show/:filename')
  showFileName(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: 'images' });
  }

  @Get('showPdf/:filename')
  showPdfFileName(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(filename, { root: 'pdfs' });
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadFileService.remove(+id);
  }
}
