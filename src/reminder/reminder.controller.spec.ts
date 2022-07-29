import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Reminder } from './entities/reminder.entity';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';

const reminderList: Reminder[] = [
  new Reminder({
    id: 1,
    userId: 1,
    title: 'A fazer 1',
    description: 'compromisso1',
  }),
  new Reminder({
    id: 2,
    userId: 1,
    title: 'A fazer 2',
    description: 'compromisso2',
  }),
  new Reminder({
    id: 3,
    userId: 1,
    title: 'A fazer 3',
    description: 'compromisso3',
  }),
];

const newReminder: Reminder = new Reminder({
  userId: 1,
  title: 'A fazer 4',
  description: 'compromisso4',
});

const updatedReminder: Reminder = new Reminder({
  id: 3,
  title: 'A fazer 3',
  description: 'compromisso3 detalhado',
});

const updatedReminderStatus: Reminder = new Reminder({
  id: 3,
  title: 'A fazer 3',
  description: 'compromisso3 detalhado',
  status: true,
});

const deletedReminder = {
  raw: [],
  affected: 1,
};

describe('ReminderController', () => {
  let reminderController: ReminderController;
  let reminderService: ReminderService;

  beforeEach(async () => {
    const mockJwtGuard = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReminderController],
      providers: [
        {
          provide: ReminderService,
          useValue: {
            create: jest.fn().mockResolvedValue(newReminder),
            findAllByUser: jest.fn().mockResolvedValue(reminderList),
            get: jest.fn().mockResolvedValue(reminderList[0]),
            update: jest.fn().mockResolvedValue(updatedReminder),
            remove: jest.fn().mockResolvedValue(deletedReminder),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtGuard)
      .compile();

    reminderController = module.get<ReminderController>(ReminderController);
    reminderService = module.get<ReminderService>(ReminderService);
  });

  it('should be defined', () => {
    expect(reminderController).toBeDefined();
    expect(reminderService).toBeDefined();
  });

  describe('create', () => {
    it('should return the created reminder', async () => {
      //Arrange
      const body: CreateReminderDto = {
        userId: 1,
        title: 'user@example.com',
        description: '',
      };

      //Act
      const result = await reminderController.create(body);

      //Assert
      expect(result).toEqual(newReminder);
      expect(reminderService.create).toHaveBeenCalledTimes(1);
      expect(reminderService.create).toHaveBeenCalledWith(body);
    });

    it('should throw an exeption', () => {
      //Arrange
      const body: CreateReminderDto = {
        userId: 1,
        title: 'user@example.com',
        description: '',
      };
      jest.spyOn(reminderService, 'create').mockRejectedValueOnce(new Error());

      //Assert
      expect(reminderController.create(body)).rejects.toThrowError();
    });
  });

  describe('findAllByUser', () => {
    it("should return a list of user's reminders ", async () => {
      //Act
      const result = await reminderController.findAllByUser('1');

      //Assert
      expect(result).toEqual(reminderList);
      expect(reminderService.findAllByUser).toHaveBeenCalledTimes(1);
    });

    it('should throw an exeption', () => {
      //Arrange
      jest
        .spyOn(reminderService, 'findAllByUser')
        .mockRejectedValueOnce(new Error());

      //Assert
      expect(reminderController.findAllByUser('1')).rejects.toThrowError();
    });
  });

  describe('get', () => {
    it('should return a reminder', async () => {
      //Act
      const result = await reminderController.findOne('1');

      //Assert
      expect(result).toEqual(reminderList[0]);
      expect(reminderService.get).toHaveBeenCalledTimes(1);
      expect(reminderService.get).toHaveBeenCalledWith(1);
    });

    it('should throw an exeption', () => {
      //Arrange
      jest.spyOn(reminderService, 'get').mockRejectedValueOnce(new Error());

      //Assert
      expect(reminderController.findOne('0')).rejects.toThrowError();
    });

    it('should throw a NotFoundException', () => {
      //Arrange
      jest
        .spyOn(reminderService, 'get')
        .mockRejectedValueOnce(
          new NotFoundException('Identificador não encontrado'),
        );

      //Assert
      expect(reminderController.findOne('0')).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should return the updated reminder', async () => {
      //Arrange
      const body: UpdateReminderDto = {
        title: 'user@example.com.br',
        status: false,
      };

      //Act
      const result = await reminderController.update('1', body);

      //Assert
      expect(result).toEqual(updatedReminder);
      expect(reminderService.update).toHaveBeenCalledTimes(1);
      expect(reminderService.update).toHaveBeenCalledWith(1, body);
    });

    it('should throw an exeption', () => {
      //Arrange
      const body: UpdateReminderDto = {
        title: 'user@example.com.br',
        status: false,
      };

      jest.spyOn(reminderService, 'update').mockRejectedValueOnce(new Error());

      //Assert
      expect(reminderController.update('1', body)).rejects.toThrowError();
    });
  });

  describe('updateStatus', () => {
    it("should return the updated reminder's status", async () => {
      //Arrange
      const check = true;

      //Act
      const result = await reminderController.updateStatus('1', '1');

      //Assert
      expect(result).toEqual(updatedReminder);
      expect(reminderService.update).toHaveBeenCalledTimes(1);
      expect(reminderService.update).toHaveBeenCalledWith(1, { status: check });
    });

    it('should throw an exeption', () => {
      //Arrange
      const check = false;

      jest.spyOn(reminderService, 'update').mockRejectedValueOnce(new Error());

      //Assert
      expect(
        reminderController.update('1', { status: check }),
      ).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should return the number of affeted rows', async () => {
      //Act
      const result = await reminderController.remove('1');

      //Assert
      expect(result).toEqual(deletedReminder);
      expect(reminderService.remove).toHaveBeenCalledTimes(1);
      expect(reminderService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw an exeption', () => {
      //Arrange
      jest.spyOn(reminderService, 'remove').mockRejectedValueOnce(new Error());

      //Assert
      expect(reminderController.remove('1')).rejects.toThrowError();
    });
  });
});
