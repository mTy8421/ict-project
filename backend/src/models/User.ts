import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

import * as bcrypt from "bcrypt";

type UserRoleType =
  | "admin"
  | "หัวหน้าสำนักงาน"
  | "พนักงาน"
  | "พนักงานฝ่ายวิจัยและนวัตกรรม"
  | "พนักงานฝ่ายคุณภาพนิสิต"
  | "พนักงานฝ่ายยุทธศาสตร์และพัฒนาองค์กร"
  | "พนักงานฝ่ายวิชาการ"
  | "คณบดี"
  | "คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร"
  | "รองคณบดีฝ่ายวิชาการ"
  | "รองคณบดีฝ่ายวิจัยและนวัตถกรรม"
  | "รองคณบดีฝ่ายคุณภาพนิสิต";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ unique: true })
  email!: string;
  @Column()
  name!: string;
  @Column()
  password!: string;
  @Column({
    type: "enum",
    enum: [
      "admin",
      "หัวหน้าสำนักงาน",
      "พนักงาน",
      "พนักงานฝ่ายวิจัยและนวัตกรรม",
      "พนักงานฝ่ายคุณภาพนิสิต",
      "พนักงานฝ่ายยุทธศาสตร์และพัฒนาองค์กร",
      "พนักงานฝ่ายวิชาการ",
      "คณบดี",
      "คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร",
      "รองคณบดีฝ่ายวิชาการ",
      "รองคณบดีฝ่ายวิจัยและนวัตถกรรม",
      "รองคณบดีฝ่ายคุณภาพนิสิต",
    ],
    default: "พนักงาน",
  })
  user_role!: UserRoleType;

  @BeforeInsert()
  async beforeInsert() {
    const pass = await bcrypt.hash(this.password, 10);
    // console.log(`insert : ${this.password}`);
    this.password = pass;
  }

  @BeforeUpdate()
  async beforeUpdate() {
    const pass = await bcrypt.hash(this.password, 10);
    // console.log(`update : ${this.password}`);
    this.password = pass;
  }
}
