import { MatchHistory } from "./match_history.entity";
import { Users } from "./users.entity";
declare const entities: (typeof Users | typeof MatchHistory)[];
export { Users, MatchHistory };
export default entities;
