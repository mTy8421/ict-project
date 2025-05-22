import { Test, TestingModule } from '@nestjs/testing';
import { UploadTestService } from './upload-test.service';

describe('UploadTestService', () => {
  let service: UploadTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadTestService],
    }).compile();

    service = module.get<UploadTestService>(UploadTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
