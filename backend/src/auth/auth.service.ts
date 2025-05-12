import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

type UserResponse = {
  user_id: number;
  user_email: string;
  user_name: string;
  user_role: User['user_role'];
  workloads: User['workloads'];
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponse | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.user_password))) {
      const { user_password, ...result } = user;
      return result as UserResponse;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.user_name,
      sub: user.user_id,
      role: user.user_role,
      email: user.user_email
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
