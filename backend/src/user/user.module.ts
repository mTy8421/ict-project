import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Work } from 'src/work/entities/work.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Work])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
