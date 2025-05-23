import { Test, TestingModule } from '@nestjs/testing';
import { UploadTestController } from './upload-test.controller';
import { UploadTestService } from './upload-test.service';

describe('UploadTestController', () => {
  let controller: UploadTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadTestController],
      providers: [UploadTestService],
    }).compile();

    controller = module.get<UploadTestController>(UploadTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
