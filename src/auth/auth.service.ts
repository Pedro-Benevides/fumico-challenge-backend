import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compareSync } from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    let user: User;

    try {
      user = await this.userService.findByEmail(email);
    } catch (error) {
      return null;
    }

    const match = compareSync(password, user.password);
    if (!match) {
      return null;
    }

    return user;
  }

  async login(user: User): Promise<any> {
    const payload = { sub: user.id, email: user.email };
    const { password, ...result } = user;

    return {
      user: result,
      access_token: this.jwtService.sign(payload),
    };
  }
}
