import { Module } from '@nestjs/common';
import { WorkService } from './work.service';
import { WorkController } from './work.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Work } from './entities/work.entity';
import { User } from 'src/user/entities/user.entity';
import { Option } from 'src/option/entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Work, User, Option])],
  controllers: [WorkController],
  providers: [WorkService],
})
export class WorkModule {}
