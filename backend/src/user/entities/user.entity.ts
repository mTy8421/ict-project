import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  AfterLoad,
  AfterInsert,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Workload } from '../../workload/entities/workload.entity';

type UserRoleType =
  | 'admin'
  | 'หัวหน้าสำนักงาน'
  | 'พนักงาน'
  | 'พนักงานฝ่ายวิจัยและนวัตถกรรม'
  | 'พนักงานฝ่ายคุณภาพนิสิต'
  | 'พนักงานฝ่ายยุทธศาสตร์และพัฒนาองค์กร'
  | 'พนักงานฝ่ายวิชาการ'
  | 'คณบดี'
  | 'คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร'
  | 'รองคณบดีฝ่ายวิชาการ'
  | 'รองคณบดีฝ่ายวิจัยและนวัตถกรรม'
  | 'รองคณบดีฝ่ายคุณภาพนิสิต';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;
  @Column({ unique: true })
  user_email: string;
  @Column()
  user_name: string;
  @Column()
  user_password: string;
  @Column({
    // type: 'enum',
    // enum: [
    //   'admin',
    //   'หัวหน้าสำนักงาน',
    //   'พนักงาน',
    //   'พนักงานฝ่ายวิจัยและนวัตถกรรม',
    //   'พนักงานฝ่ายคุณภาพนิสิต',
    //   'พนักงานฝ่ายยุทธศาสตร์และพัฒนาองค์กร',
    //   'พนักงานฝ่ายวิชาการ',
    //   'คณบดี',
    //   'คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร',
    //   'รองคณบดีฝ่ายวิชาการ',
    //   'รองคณบดีฝ่ายวิจัยและนวัตถกรรม',
    //   'รองคณบดีฝ่ายคุณภาพนิสิต',
    // ],
    default: 'พนักงาน',
  })
  // user_role: UserRoleType;
  user_role: string;

  @OneToMany(() => Workload, (workload) => workload.assignedTo)
  workloads: Workload[];

  // @BeforeInsert()
  // async hashPassword() {
  //   this.user_password = await bcrypt.hash(this.user_password, 10);
  // }
  //
  // @BeforeUpdate()
  // async updatePassword() {
  //   if (this.user_password) {
  //     this.user_password = await bcrypt.hash(this.user_password, 10);
  //   }
  // }
}
@Entity()
export class titleWork {
  @PrimaryGeneratedColumn()
  title_id: number;
  @Column()
  title_topic: string;
  @Column()
  title_detail: string;
  @Column()
  title_type: string;
  @Column()
  title_time: string;
  @Column()
  title_date: string;
  @Column()
  title_status: number;
}
