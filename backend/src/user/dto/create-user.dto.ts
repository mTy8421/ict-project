import { IsEmail, IsNotEmpty } from 'class-validator';

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

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  user_email: string;

  @IsNotEmpty()
  user_name: string;

  @IsNotEmpty()
  user_password: string;

  @IsNotEmpty()
  // user_role: UserRoleType;
  user_role: string;
}
