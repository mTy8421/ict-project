import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/profile')
  async getProfile(@Request() req) {
    return this.userService.findByEmail(req.user.user_email);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('user')
  findAllUser() {
    return this.userService.findAllUser();
  }

  @Get('head')
  findAllHead() {
    return this.userService.findAllHead();
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.userService.search(query);
  }

  @Get('filter')
  filter(@Query('department') department: string) {
    return this.userService.filterByDepartment(department);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
