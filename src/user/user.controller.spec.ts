import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
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

const deletedUser = {
  raw: [],
  affected: 1,
};

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(newUser),
            findAll: jest.fn().mockResolvedValue(userList),
            findOne: jest.fn().mockResolvedValue(userList[0]),
            update: jest.fn().mockResolvedValue(updatedUser),
            remove: jest.fn().mockResolvedValue(deletedUser),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should return the created user', async () => {
      //Arrange
      const body: CreateUserDto = {
        email: 'user@example.com',
        password: 'password',
      };

      //Act
      const result = await userController.create(body);

      //Assert
      expect(result).toEqual(newUser);
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(userService.create).toHaveBeenCalledWith(body);
    });

    it('should throw an exeption', () => {
      //Arrange
      const body: CreateUserDto = {
        email: 'user@example.com',
        password: '',
      };

      jest.spyOn(userService, 'create').mockRejectedValueOnce(new Error());

      //Assert
      expect(userController.create(body)).rejects.toThrowError();
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      //Act
      const result = await userController.findAll();

      //Assert
      expect(result).toEqual(userList);
      expect(userService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exeption', () => {
      //Arrange
      jest.spyOn(userService, 'findAll').mockRejectedValueOnce(new Error());

      //Assert
      expect(userController.findAll()).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      //Act
      const result = await userController.findOne('1');

      //Assert
      expect(result).toEqual(userList[0]);
      expect(userService.findOne).toHaveBeenCalledTimes(1);
      expect(userService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an exeption', () => {
      //Arrange
      jest.spyOn(userService, 'findOne').mockRejectedValueOnce(new Error());

      //Assert
      expect(userController.findOne('0')).rejects.toThrowError();
    });

    it('should throw a NotFoundException', () => {
      //Arrange
      jest
        .spyOn(userService, 'findOne')
        .mockRejectedValueOnce(
          new NotFoundException('Identificador não encontrado'),
        );

      //Assert
      expect(userController.findOne('0')).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should return the updated user', async () => {
      //Arrange
      const body: UpdateUserDto = {
        email: 'user@example.com.br',
      };

      //Act
      const result = await userController.update('1', body);

      //Assert
      expect(result).toEqual(updatedUser);
      expect(userService.update).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledWith(1, body);
    });

    it('should throw an exeption', () => {
      //Arrange
      const body: UpdateUserDto = {
        email: 'user@example.com.br',
      };

      jest.spyOn(userService, 'update').mockRejectedValueOnce(new Error());

      //Assert
      expect(userController.update('1', body)).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should return nothing', async () => {
      //Act
      const result = await userController.remove('1');

      //Assert
      expect(result).toEqual(deletedUser);
      expect(userService.remove).toHaveBeenCalledTimes(1);
      expect(userService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw an exeption', () => {
      //Arrange
      jest.spyOn(userService, 'remove').mockRejectedValueOnce(new Error());

      //Assert
      expect(userController.remove('1')).rejects.toThrowError();
    });
  });
});
