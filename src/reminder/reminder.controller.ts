import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Controller('reminders')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Post()
  create(@Body() createReminderDto: CreateReminderDto) {
    return this.reminderService.create(createReminderDto);
  }

  @Get('/users/:userId')
  findAll(@Param('userId') userId: string) {
    return this.reminderService.findAllByUser(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reminderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReminderDto: UpdateReminderDto) {
    return this.reminderService.update(+id, updateReminderDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Query('check') check: string) {
    return this.reminderService.update(+id, { status: +check ? true : false });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reminderService.remove(+id);
  }
}
