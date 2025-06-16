import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { WorkService } from './work.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { Request } from 'express';

@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @Post()
  create(@Body() createWorkDto: CreateWorkDto) {
    return this.workService.create(createWorkDto);
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
  update(@Param('id') id: string, @Body() updateWorkDto: UpdateWorkDto) {
    return this.workService.update(+id, updateWorkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workService.remove(+id);
  }

  @Get('user')
  findByUser(@Req() req: Request) {
    const user = req.user as { user_id: number };
    return this.workService.findByUser(user.user_id);
  }
}
