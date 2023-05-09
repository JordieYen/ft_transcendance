import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Achievement {
    @PrimaryGeneratedColumn()
    uid: number;

    @Column({ default: 0 })
    achievement_1: number;

    @Column({ default: 0 })
    achievement_2: number;
}
