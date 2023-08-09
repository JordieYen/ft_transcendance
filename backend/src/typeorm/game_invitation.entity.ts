import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum GameInvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

@Entity({ name: 'game_invitation' })
export class GameInvitation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentGameInvitations)
  sender: User;

  @ManyToOne(() => User, (user) => user.receiveGameInvitations)
  receiver: User;

  @Column()
  status: GameInvitationStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  acceptedAt: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  declinedAt: Date | null;
}
