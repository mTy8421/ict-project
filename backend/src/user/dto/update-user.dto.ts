import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsObject, IsEmail } from 'class-validator';

// type UserRoleType =
//   | 'admin'
//   | 'หัวหน้าสำนักงาน'
//   | 'พนักงาน'
//   | 'พนักงานฝ่ายวิจัยและนวัตถกรรม'
//   | 'พนักงานฝ่ายคุณภาพนิสิต'
//   | 'พนักงานฝ่ายยุทธศาสตร์และพัฒนาองค์กร'
//   | 'พนักงานฝ่ายวิชาการ'
//   | 'คณบดี'
//   | 'คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร'
//   | 'รองคณบดีฝ่ายวิชาการ'
//   | 'รองคณบดีฝ่ายวิจัยและนวัตถกรรม'
//   | 'รองคณบดีฝ่ายคุณภาพนิสิต';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsObject()
  @IsEmail()
  user_email: string;

  @IsObject()
  user_name: string;

  @IsObject()
  user_password: string;

  @IsObject()
  // user_role: UserRoleType;
  user_role: string;
}
