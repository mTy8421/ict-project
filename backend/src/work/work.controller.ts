import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { WorkService } from './work.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @UseGuards(JwtAuthGuard)
  @Get('user')
  findByUser(@Req() req: Request) {
    const user = req.user as { user_id: number };
    return this.workService.findByUser(user.user_id);
  }

  @Get('head')
  findAllUser() {
    return this.workService.findAllUser();
  }

  @Get('head/:id')
  findByUserHead(@Param('id') id: string) {
    return this.workService.findByUser(+id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('fileUpload'))
  create(
    @Body() createWorkDto: CreateWorkDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.workService.create(createWorkDto, files);
  }

  @Get()
  findAll() {
    return this.workService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('fileUpload'))
  update(
    @Param('id') id: string,
    @Body() updateWorkDto: UpdateWorkDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.workService.update(+id, updateWorkDto, files);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workService.remove(+id);
  }
}
