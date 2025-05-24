import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UploadTestService } from './upload-test.service';
import { CreateUploadTestDto } from './dto/create-upload-test.dto';
import { UpdateUploadTestDto } from './dto/update-upload-test.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { File as MulterFile } from 'multer';

@Controller('upload-test')
export class UploadTestController {
  constructor(private readonly uploadTestService: UploadTestService) {}

  @Post()
  create(@Body() createUploadTestDto: CreateUploadTestDto) {
    return this.uploadTestService.create(createUploadTestDto);
  }

  @Get()
  findAll() {
    return this.uploadTestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadTestService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUploadTestDto: UpdateUploadTestDto,
  ) {
    return this.uploadTestService.update(+id, updateUploadTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadTestService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadMapFile(@UploadedFile() file: MulterFile) {
    return this.uploadTestService.uploadFile(file);
  }
}
