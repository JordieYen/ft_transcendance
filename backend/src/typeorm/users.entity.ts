import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'user_id',
  })
  id: number;

  @Column({
    nullable: false,
    default: '',
    unique: true,
  })
  username: string;

  @Column()
  boolean: boolean;

  @Column()
  password: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  role: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
