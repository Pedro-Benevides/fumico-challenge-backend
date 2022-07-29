import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Reminder } from './entities/reminder.entity';
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

describe('ReminderService', () => {
  let reminderService: ReminderService;
  let reminderRepo: Repository<Reminder>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReminderService,
        {
          provide: getRepositoryToken(Reminder),
          useValue: {
            save: jest.fn().mockResolvedValue(newReminder),
            findBy: jest.fn().mockResolvedValue(reminderList),
            findOneByOrFail: jest.fn().mockResolvedValue(reminderList[0]),
            update: jest.fn().mockResolvedValue(updatedReminder),
            delete: jest.fn().mockResolvedValue(deletedReminder),
          },
        },
      ],
    }).compile();

    reminderService = module.get<ReminderService>(ReminderService);
    reminderRepo = module.get<Repository<Reminder>>(
      getRepositoryToken(Reminder),
    );
  });

  it('should be defined', () => {
    expect(reminderService).toBeDefined();
    expect(reminderRepo).toBeDefined();
  });

  describe('create', () => {
    it('should return the created reminder', async () => {
      //Arrange
      const createReminderDto: CreateReminderDto = {
        userId: 1,
        title: 'user@example.com',
        description: '',
      };

      //Act
      const result = await reminderService.create(createReminderDto);

      //Assert
      expect(result).toEqual(newReminder);
      expect(reminderRepo.save).toHaveBeenCalledTimes(1);
      expect(reminderRepo.save).toHaveBeenCalledWith(createReminderDto);
    });

    it('should throw an exeption', () => {
      //Arrange
      const createReminderDto: CreateReminderDto = {
        userId: 1,
        title: 'user@example.com',
        description: '',
      };

      jest.spyOn(reminderRepo, 'save').mockRejectedValueOnce(new Error());

      //Assert
      expect(reminderService.create(createReminderDto)).rejects.toThrowError();
    });
  });
  describe('findAllByUser', () => {
    it("should return a list of user's reminders ", async () => {
      //Act
      const result = await reminderService.findAllByUser(1);

      //Assert
      expect(result).toEqual(reminderList);
      expect(reminderRepo.findBy).toHaveBeenCalledTimes(1);
      expect(reminderRepo.findBy).toHaveBeenCalledWith({ userId: 1 });
    });

    it('should throw an exeption', () => {
      //Arrange
      jest.spyOn(reminderRepo, 'findBy').mockRejectedValueOnce(new Error());

      //Assert
      expect(reminderService.findAllByUser(1)).rejects.toThrowError();
    });
  });

  describe('get', () => {
    it('should return a reminder', async () => {
      //Act
      const result = await reminderRepo.findOneByOrFail({ id: 1 });

      //Assert
      expect(result).toEqual(reminderList[0]);
      expect(reminderRepo.findOneByOrFail).toHaveBeenCalledTimes(1);
      expect(reminderRepo.findOneByOrFail).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an exeption', () => {
      //Arrange
      jest
        .spyOn(reminderRepo, 'findOneByOrFail')
        .mockRejectedValueOnce(new Error());

      //Assert
      expect(reminderService.get(0)).rejects.toThrowError();
    });

    it('should throw a NotFoundException', () => {
      //Arrange
      jest
        .spyOn(reminderRepo, 'findOneByOrFail')
        .mockRejectedValueOnce(
          new NotFoundException('Identificador não encontrado'),
        );

      //Assert
      expect(reminderService.get(0)).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should return the updated reminder', async () => {
      //Arrange
      const updatedReminderDto: UpdateReminderDto = {
        title: 'user@example.com.br',
        status: false,
      };

      //Act
      const result = await reminderService.update(1, updatedReminderDto);

      //Assert
      expect(result).toEqual(updatedReminder);
      expect(reminderRepo.update).toHaveBeenCalledTimes(1);
      expect(reminderRepo.update).toHaveBeenCalledWith(1, updatedReminderDto);
    });

    it('should throw an exeption', () => {
      //Arrange
      const updatedReminderDto: UpdateReminderDto = {
        title: 'user@example.com.br',
        status: false,
      };

      jest.spyOn(reminderRepo, 'update').mockRejectedValueOnce(new Error());

      //Assert
      expect(
        reminderService.update(1, updatedReminderDto),
      ).rejects.toThrowError();
    });
  });

  describe('remove', () => {
    it('should return the number of affeted rows', async () => {
      //Act
      const result = await reminderService.remove(1);

      //Assert
      expect(result).toEqual(deletedReminder);
      expect(reminderRepo.delete).toHaveBeenCalledTimes(1);
      expect(reminderRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an exeption', () => {
      //Arrange
      jest.spyOn(reminderRepo, 'delete').mockRejectedValueOnce(new Error());

      //Assert
      expect(reminderService.remove(1)).rejects.toThrowError();
    });
  });
});
