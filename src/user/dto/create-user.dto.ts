import { hash } from 'bcrypt';

export class CreateUserDto {
  email: string;
  password: string;

  async setPassword(password: string) {
    this.password = await hash(password, 10);
  }
}
