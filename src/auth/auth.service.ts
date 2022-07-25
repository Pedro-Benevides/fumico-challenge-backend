import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    const match = await bcrypt.compare(password, user.password);

    if (user && match) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
