import { Module } from '@nestjs/common';
import { UploadTestService } from './upload-test.service';
import { UploadTestController } from './upload-test.controller';

@Module({
  controllers: [UploadTestController],
  providers: [UploadTestService],
})
export class UploadTestModule {}
