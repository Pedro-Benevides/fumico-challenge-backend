import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

const userList: User[] = [
  new User({ id: 1, email: 'user1@mail.com' }),
  new User({ id: 2, email: 'user2@mail.com' }),
  new User({ id: 3, email: 'user3@mail.com' }),
];

const newUser: User = new User({
  email: 'user4@example.com',
  password: 'password',
});

const updatedUser: User = new User({
  id: 1,
  email: 'user@example.com.br',
});


describe('UserService', () => {
  let userService: UserService;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(userList[0]),
            save: jest.fn().mockResolvedValue(newUser),
            find: jest.fn().mockResolvedValue(userList),
            findOneByOrFail: jest.fn().mockResolvedValue(userList[0]),
            update: jest.fn().mockResolvedValue(updatedUser),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepo).toBeDefined();
  });

  describe('create', () => {
    it('should return the created user', async () => {
      //Arrange
      const createUserDto: CreateUserDto = {
        email: 'user@example.com',
        password: 'password',
      };

      //Act
      const result = await userService.create(createUserDto);

      //Assert
      expect(result).toEqual(newUser);
    });

    it('should throw an exeption', () => {
      //Arrange
      const createUserDto: CreateUserDto = {
        email: 'user@example.com',
        password: '',
      };

      jest.spyOn(userRepo, 'save').mockRejectedValueOnce(new Error());

      //Assert
      expect(userService.create(createUserDto)).rejects.toThrowError();
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      //Act
      const result = await userService.findAll();

      //Assert
      expect(result).toEqual(userList);
      expect(userRepo.find).toHaveBeenCalledTimes(1);
    });

    it('should throw an exeption', () => {
      //Arrange
      jest.spyOn(userRepo, 'find').mockRejectedValueOnce(new Error());

      //Assert
      expect(userService.findAll()).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      //Act
      const result = await userService.findOne(1);

      //Assert
      expect(result).toEqual(userList[0]);
      expect(userRepo.findOneByOrFail).toHaveBeenCalledTimes(1);
      expect(userRepo.findOneByOrFail).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an exeption', () => {
      //Arrange
      jest.spyOn(userRepo, 'findOneByOrFail').mockRejectedValueOnce(new Error());

      //Assert
      expect(userService.findOne(0)).rejects.toThrowError();
    });

    it('should throw a NotFoundException', () => {
      //Arrange
      jest
        .spyOn(userRepo, 'findOneByOrFail')
        .mockRejectedValueOnce(
          new NotFoundException('Identificador não encontrado'),
        );

      //Assert
      expect(userService.findOne(0)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should return the updated user', async () => {
      //Arrange
      const updateUserDto: UpdateUserDto = {
        email: 'user@example.com.br',
      };

      //Act
      const result = await userService.update(1, updateUserDto);

      //Assert
      expect(result).toEqual(updatedUser);
      expect(userRepo.update).toHaveBeenCalledTimes(1);
      expect(userRepo.update).toHaveBeenCalledWith(1, updateUserDto);
    });

    it('should throw an exeption', () => {
      //Arrange
      const updateUserDto: UpdateUserDto = {
        email: 'user@example.com.br',
      };

      jest.spyOn(userRepo, 'update').mockRejectedValueOnce(new Error());

      //Assert
      expect(userService.update(1, updateUserDto)).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should return the number of affeted rows', async () => {
      //Act
      const result = await userService.remove(1);

      //Assert
      expect(userRepo.delete).toHaveBeenCalledTimes(1);
      expect(userRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an exeption', () => {
      //Arrange
      jest.spyOn(userRepo, 'delete').mockRejectedValueOnce(new Error());

      //Assert
      expect(userService.remove(1)).rejects.toThrowError();
    });
  });
});
