import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Reminder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  status: boolean;

  @CreateDateColumn({ nullable: true, select: false })
  createdAt?: Date;

  @UpdateDateColumn({ nullable: true, select: false })
  updatedAt?: Date;

  constructor(reminder: Partial<Reminder>) {
    reminder.id = this.id;
    reminder.userId = this.userId;
    reminder.title = this.title;
    reminder.description = this.description;
    reminder.status = this.status;
    reminder.createdAt = this.createdAt;
    reminder.updatedAt = this.updatedAt;
  }
}
