import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      user_name: createUserDto.user_name,
      user_email: createUserDto.user_email,
      user_role: createUserDto.user_role,
      user_password: createUserDto.user_password,
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findAllUser(): Promise<User[]> {
    const users = this.userRepository
      .createQueryBuilder('user')
      .where('user.user_role != :user_role AND user.user_role != :user_role2', {
        user_role: 'หัวหน้าสำนักงาน',
        user_role2: 'admin',
      })
      .getMany();
    return users;
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { user_id: id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ user_id: id }, updateUserDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete({ user_id: id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { user_email: email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { user_name: username } });
  }

  async search(query: string): Promise<User[]> {
    return this.userRepository.find({
      where: [
        { user_name: Like(`%${query}%`) },
        { user_email: Like(`%${query}%`) },
      ],
    });
  }

  async filterByDepartment(department: string): Promise<User[]> {
    const roles = [
      'พนักงานฝ่ายวิจัยและนวัตถกรรม',
      'พนักงานฝ่ายคุณภาพนิสิต',
      'พนักงานฝ่ายยุทธศาสตร์และพัฒนาองค์กร',
      'พนักงานฝ่ายวิชาการ',
      'คณบดีฝ่ายยุทธศาสตร์และพัฒนาองค์กร',
      'รองคณบดีฝ่ายวิชาการ',
      'รองคณบดีฝ่ายวิจัยและนวัตถกรรม',
      'รองคณบดีฝ่ายคุณภาพนิสิต',
    ] as const;

    return this.userRepository.find({
      where: roles.map((role) => ({ user_role: role })),
    });
  }
}
