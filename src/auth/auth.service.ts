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
    const user = await this.userService.findByEmail(email);
    const match = compareSync(password, user.password);

    if (user && match) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<any> {
    const payload = { sub: user.id, email: user.email };

    return {
      user: user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
