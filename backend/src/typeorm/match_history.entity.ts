import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class MatchHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    winner_uid: number; 

    @ManyToOne(() => User, user => user.p1_match, { nullable: false})
    p1_uid: number;

    @ManyToOne(() => User, user => user.p2_match, { nullable: false })
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
    data_of_creation: Date;
}
