import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Reminder } from './entities/reminder.entity';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,
  ) {
    //
  }

  async create(createReminderDto: CreateReminderDto): Promise<Reminder> {
    return await this.reminderRepository.save(createReminderDto);
  }

  async findAllByUser(userId: number) {
    return await this.reminderRepository.findBy({ userId });
  }

  async findOne(id: number) {
    return await this.reminderRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateReminderDto: UpdateReminderDto) {
    await this.reminderRepository.update(id, updateReminderDto);

    return await this.findOne(id);
  }

  async remove(id: number) {
    return await this.reminderRepository.delete(id);
  }
}
