import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class MatchHistory {
    @PrimaryGeneratedColumn()
    match_uid: number;

    @Column()
    winner_uid: number; 

    @Column()
    p1_uid: number;

    @Column()
    p2_uid: number;

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
