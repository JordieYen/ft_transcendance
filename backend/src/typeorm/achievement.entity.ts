import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Achievement {
    @PrimaryGeneratedColumn()
    id: number;
    
    @OneToOne(() => User, user => user.achievement)
    user: User;

    @Column({ default: 0 })
    achievement_1: number;

    @Column({ default: 0 })
    achievement_2: number;
}
