import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Channel, (channel) => channel.messages, {
    onDelete: 'CASCADE',
  })
  channel: Channel;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @Column()
  message_content: string;

  @Column()
  message_type: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
