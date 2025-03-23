import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

type UserRoleType =
  | 'admin'
  | 'หัวหน้าสำนักงาน'
  | 'พนักงาน'
  | 'คณบดี'
  | 'คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร'
  | 'รองคณบดีฝ่ายวิชาการ'
  | 'รองคณบดีฝ่ายวิจัยและนวัตถกรรม'
  | 'รองคณบดีฝ่ายคุณภาพนิสิต';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;
  @Column()
  user_email: string;
  @Column()
  user_name: string;
  @Column()
  user_password: string;
  @Column({
    type: 'enum',
    enum: [
      'admin',
      'หัวหน้าสำนักงาน',
      'พนักงาน',
      'คณบดี',
      'คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร',
      'รองคณบดีฝ่ายวิชาการ',
      'รองคณบดีฝ่ายวิจัยและนวัตถกรรม',
      'รองคณบดีฝ่ายคุณภาพนิสิต',
    ],
    default: 'พนักงาน',
  })
  user_role: UserRoleType;

  @BeforeInsert()
  async beforeInsert() {
    const pass = await bcrypt.hash(this.user_password, 10);
    // console.log(`insert : ${this.user_password}`);
    this.user_password = pass;
  }

  @BeforeUpdate()
  async beforeUpdate() {
    const pass = await bcrypt.hash(this.user_password, 10);
    // console.log(`update : ${this.user_password}`);
    this.user_password = pass;
  }
}
