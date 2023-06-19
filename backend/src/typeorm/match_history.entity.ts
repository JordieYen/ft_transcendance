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

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    date_of_creation: Date;
}
