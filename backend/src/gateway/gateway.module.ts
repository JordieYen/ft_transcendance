import { Module } from "@nestjs/common";
import { FriendModule } from "src/friend/friend.module";
import { MyGateway } from "./gateway";

@Module({
    imports: [
        FriendModule
    ],
    providers: [
        MyGateway,
    ],
})

export class GatewayModule {}
