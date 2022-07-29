import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password?: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  constructor(user?: Partial<User>) {
    user.id = this.id;
    user.email = this.email;
    user.password = this.password;
    user.createdAt = this.createdAt;
    user.updatedAt = this.updatedAt;
  }
}
