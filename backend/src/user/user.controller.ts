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
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // @Roles('admin', 'คณบดี')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/profile')
  async getProfile(@Request() req) {
    const result = await this.userService.findByEmail(req.user.user_email);
    return result;
  }

  @Get()
  // @Roles('admin', 'คณบดี')
  findAll() {
    return this.userService.findAll();
  }

  @Get('user')
  findAllUser() {
    return this.userService.findAllUser();
  }

  @Get('search')
  // @Roles('admin', 'คณบดี')
  search(@Query('query') query: string) {
    return this.userService.search(query);
  }

  @Get('filter')
  // @Roles('admin', 'คณบดี')
  filter(@Query('department') department: string) {
    return this.userService.filterByDepartment(department);
  }

  @Get(':id')
  // @Roles('admin', 'คณบดี')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  // @Roles('admin', 'คณบดี')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  // @Roles('admin', 'คณบดี')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
