import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    try {
      if (user && (await bcrypt.compare(password, user.user_password))) {
        return {
          email: user.user_email,
          user: user.user_name,
          role: user.user_role,
        };
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async login(user: any) {
    const payload = { email: user.user_email, sub: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
