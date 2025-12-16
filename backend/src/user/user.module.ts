import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Work } from 'src/work/entities/work.entity';
import { Option } from 'src/option/entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Work, Option])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
