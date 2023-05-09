import { Stat } from './stats.entity';
export declare class User {
    id: number;
    intra_uid: number;
    username: string;
    avatar: string;
    online: boolean;
    createdAt: Date;
    updatedAt: Date;
    stat: Stat;
}
