import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MatchHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    winner_uid: number; 

    @Column()
    p1_uid: number;

    @Column()
    p2_uid: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    data_of_creation: Date;
}
