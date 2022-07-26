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
}
