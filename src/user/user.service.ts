import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await hash(createUserDto.password, 10);

    const existingUser = await this.findByEmail(createUserDto.email);

    let user: User;

    if (existingUser) {
      user = existingUser;
    } else {
      user = await this.userRepository.save(createUserDto);
    }

    const { password, ...result } = user;
    return result;
  }

  async findAll(): Promise<User[]> {
    return (await this.userRepository.find()).map((user: User) => {
      let { password, ...result } = user;

      return result;
    });
  }

  async findOne(id: number): Promise<User> {
    let user: User;
    try {
      user = await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('Identificador Não Encontrado');
    }

    const { password, ...result } = user;

    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
