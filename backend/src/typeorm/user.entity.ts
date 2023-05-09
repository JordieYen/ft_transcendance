import { BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Stat } from './stats.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    intra_uid: number;

    @Column({ unique: true, nullable: true })
    username: string;

    @Column({ default: 'default_avatar.png'})
    avatar: string;

    @Column({ default: false })
    online: boolean;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
    
    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    @OneToOne(() => Stat)
    @JoinColumn()
    stat: Stat;
}
