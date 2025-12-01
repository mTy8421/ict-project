import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return a JSON object', () => {
      expect(appController.getHello()).toEqual({
        admin: 'admin',
        หัวหน้าสำนักงาน: 'หัวหน้าสำนักงาน',
        พนักงาน: 'พนักงาน',
        คณบดี: 'คณบดี',
        คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร:
          'คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร',
        รองคณบดีฝ่ายวิชาการ: 'รองคณบดีฝ่ายวิชาการ',
        รองคณบดีฝ่ายวิจัยและนวัตถกรรม: 'รองคณบดีฝ่ายวิจัยและนวัตถกรรม',
        รองคณบดีฝ่ายคุณภาพนิสิต: 'รองคณบดีฝ่ายคุณภาพนิสิต',
      });
    });
  });
});
