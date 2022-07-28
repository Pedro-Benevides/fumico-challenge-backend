import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAllByUser(userId: number): Promise<Reminder[]> {
    return await this.reminderRepository.findBy({ userId });
  }

  async get(id: number): Promise<Reminder> {
    let reminder: Reminder;
    try {
      reminder = await this.reminderRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('Identificador Não Encontrado');
    }

    return reminder;
  }

  async update(
    id: number,
    updateReminderDto: UpdateReminderDto,
  ): Promise<Reminder> {
    await this.reminderRepository.update(id, updateReminderDto);

    return await this.get(id);
  }

  async remove(id: number) {
    return await this.reminderRepository.delete(id);
  }
}
