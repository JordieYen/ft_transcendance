import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class MatchHistory {
  @PrimaryGeneratedColumn()
  match_uid: number;

  @Column()
  winner_uid: number;

  @ManyToOne(() => User, (user) => user.p1_match, { nullable: false })
  p1: User;

  @ManyToOne(() => User, (user) => user.p2_match, { nullable: false })
  p2: User;

  @Column({ default: 0 })
  p1_score: number;

  @Column({ default: 0 })
  p2_score: number;

  @Column({ default: 0 })
  p1_smashes: number;

  @Column({ default: 0 })
  p2_smashes: number;

  @Column({ default: 1000 })
  p1_mmr: number;

  @Column({ default: 1000 })
  p2_mmr: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  date_of_creation: Date;
}
