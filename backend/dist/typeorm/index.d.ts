import { MatchHistory } from "./match_history.entity";
import { Stat } from "./stats.entity";
import { User } from "./user.entity";
declare const entities: (typeof MatchHistory | typeof User | typeof Stat)[];
export default entities;
