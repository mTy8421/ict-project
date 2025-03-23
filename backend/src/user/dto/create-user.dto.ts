type UserRoleType =
  | 'admin'
  | 'หัวหน้าสำนักงาน'
  | 'พนักงาน'
  | 'คณบดี'
  | 'คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร'
  | 'รองคณบดีฝ่ายวิชาการ'
  | 'รองคณบดีฝ่ายวิจัยและนวัตถกรรม'
  | 'รองคณบดีฝ่ายคุณภาพนิสิต';

export class CreateUserDto {
  user_email: string;
  user_name: string;
  user_password: string;
  user_role: UserRoleType;
}
