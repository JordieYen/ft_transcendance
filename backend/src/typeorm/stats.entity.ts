import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Stat {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.stat)
    user: User;

    @Column()
    wins: number;

    @Column()
    lossess: number;

    @Column()
    mmr: number;
}
