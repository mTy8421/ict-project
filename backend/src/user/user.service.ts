import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Work } from 'src/work/entities/work.entity';
import { Option } from 'src/option/entities/option.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Work) private workRepository: Repository<Work>,
    @InjectRepository(Option) private optionRepsitory: Repository<Option>,
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
      .loadRelationCountAndMap('user.sum', 'user.works', 'work', (qb) =>
        qb.where('work.status = :status', { status: 'pending' }),
      )
      .where(
        'user.user_role != :user_role AND user.user_role != :user_role2 AND user.user_role NOT LIKE "พนักงาน%" AND user.user_role NOT LIKE "%คณบดี%"',
        {
          user_role: 'หัวหน้าสำนักงาน',
          user_role2: 'admin',
        },
      )
      .getMany();
    return users;
  }

  async findAllDepartment(role: string): Promise<User[]> {
    const users = this.userRepository
      .createQueryBuilder('user')
      .loadRelationCountAndMap('user.sum', 'user.works', 'work', (qb) =>
        qb.where('work.status = :status', { status: 'pending' }),
      )
      .where('user.user_role = :user_role', {
        user_role: role,
      })
      .getMany();
    return users;
  }

  async findAllRole(role: string): Promise<User[]> {
    const users = this.userRepository
      .createQueryBuilder('user')
      .select(['user.user_name', 'user.user_role', 'user.user_id'])
      .leftJoinAndSelect('user.works', 'work')
      .leftJoinAndSelect('work.options', 'option')
      .where('user.user_role = :user_role', {
        user_role: role,
      })
      .orderBy('work.dateTimeNow', 'DESC')
      .getMany();
    return users;
  }

  async findAllUserAll(): Promise<User[]> {
    const users = this.userRepository
      .createQueryBuilder('user')
      .select(['user.user_name', 'user.user_role', 'user.user_id'])
      .leftJoinAndSelect('user.works', 'work')
      .leftJoinAndSelect('work.options', 'option')
      .where(
        'user.user_role != :user_role AND user.user_role != :user_role2 AND user.user_role NOT LIKE "พนักงาน%" AND user.user_role NOT LIKE "%คณบดี%"',
        {
          user_role: 'หัวหน้าสำนักงาน',
          user_role2: 'admin',
        },
      )
      .getMany();
    return users;
  }

  async findAllHead(): Promise<User[]> {
    const users = this.userRepository
      .createQueryBuilder('user')
      .where('user.user_role LIKE "%หัวหน้าสำนักงาน%"')
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
}
