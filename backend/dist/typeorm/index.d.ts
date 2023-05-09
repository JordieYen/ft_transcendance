import { MatchHistory } from "./match_history.entity";
import { Users } from "./users.entity";
declare const entities: (typeof MatchHistory | typeof Users)[];
export { Users, MatchHistory };
export default entities;
