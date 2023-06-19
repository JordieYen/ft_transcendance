import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Stat {
    @PrimaryGeneratedColumn()
    uid: number;

    @Column({ default: 0 })
    wins: number;

    @Column({ default: 0 })
    losses: number;

    @Column({ default: 0 })
    kills: number;

    @Column({ default: 0 })
    deaths: number;

    @Column({ default: 0 })
    smashes: number;

    @Column({ default: 0 })
    winstreak: number;

    @Column({ default: 0 })
    current_mmr: number;

    @Column({ default: 0 })
    best_mmr: number;
}
