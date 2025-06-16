import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';
import { Work } from 'src/work/entities/work.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Option, Work])],
  controllers: [OptionController],
  providers: [OptionService],
})
export class OptionModule {}
