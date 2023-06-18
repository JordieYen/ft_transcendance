import { Module } from "@nestjs/common";
import { FriendModule } from "src/friend/friend.module";
import { UsersModule } from "src/users/users.module";
import { MyGateway } from "./gateway";

@Module({
    imports: [
        FriendModule,
        UsersModule
    ],
    providers: [
        MyGateway,
    ],
})

export class GatewayModule {}
