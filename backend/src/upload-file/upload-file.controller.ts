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

  @Get('show/id/:id')
  show(@Param('id') id: string) {
    return this.uploadFileService.showImages(+id);
  }

  @Get('show/:filename')
  showFileName(@Param('filename') filename: string, @Res() res) {
    return res.sendFile(filename, { root: 'images' });
  }

  @Post()
  create(@Body() createUploadFileDto: CreateUploadFileDto) {
    return this.uploadFileService.create(createUploadFileDto);
  }

  @Get()
  findAll() {
    return this.uploadFileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadFileService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUploadFileDto: UpdateUploadFileDto,
  ) {
    return this.uploadFileService.update(+id, updateUploadFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadFileService.remove(+id);
  }
}
