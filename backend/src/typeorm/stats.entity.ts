import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Stat {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @OneToOne(() => User, user => user.stat)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ default: 0 })
    wins: number;

    @Column({ default: 0 })
    losses: number;

    @Column({ default: 0 })
    mmr: number;

    @Column({ default: 0 })
    total_games: number;

    @Column({ default: 0 })
    winStreak: number;
}
