import { ISession } from "connect-typeorm/out";
import { Column, DeleteDateColumn, Entity, Index, PrimaryColumn } from "typeorm";

@Entity()
export class SessionEntity implements ISession {
    @Index()
    @Column('bigint')
    public expiredAt = Date.now();

    @PrimaryColumn('varchar', { length: 255 })
    id = '';

    @Column('text')
    json = '';

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
