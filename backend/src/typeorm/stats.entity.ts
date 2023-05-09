import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Stat {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, user => user.stat)
    user: User;

    @Column()
    wins: number;

    @Column()
    losses: number;

    @Column()
    mmr: number;
}
