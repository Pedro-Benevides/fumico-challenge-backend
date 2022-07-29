import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';

const validatedUser = {
  user: {
    id: 1,
    email: 'teste@mail.com',
  },
  access_token: '',
};

describe('AppController', () => {
  let appController: AppController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockLocalGuard = {};

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue(validatedUser),
          },
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue(mockLocalGuard)
      .compile();

    appController = app.get<AppController>(AppController);
    authService = app.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(AppController).toBeDefined();
    expect(AuthService).toBeDefined();
  });

  describe('login', () => {
    it('should return a autenticated User', async () => {
      //Arrange
      const req = {
        user: {
          email: 'user@example.com',
          password: 'password',
        },
      };
      //Act
      const result = await appController.login(req);

      //Assert
      expect(result).toEqual(validatedUser);
      expect(authService.login).toHaveBeenCalledWith(req.user);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should throw an exeption', () => {
      //Arrange
      const req = {
        user: {
          email: 'user@example.com',
          password: 'password',
        },
      };

      jest.spyOn(authService, 'login').mockRejectedValueOnce(new Error());

      //Assert
      expect(appController.login(req)).rejects.toThrowError();
    });
  });
});
