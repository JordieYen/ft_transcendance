import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Stat {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, user => user.stat)
    user: User;

    @Column({ default: 0 })
    wins: number;

    @Column({ default: 0 })
    losses: number;

    @Column({ default: 0 })
    mmr: number;
}
