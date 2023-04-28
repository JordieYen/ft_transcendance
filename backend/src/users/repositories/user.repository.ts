import { User } from "src/typeorm/user.entity";
import { Repository } from "typeorm";

export class UserRepository extends Repository<User> {}
