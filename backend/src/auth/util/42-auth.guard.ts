import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {

    canActivate(context: ExecutionContext) {
        console.log('Executing FortyTwoAuthGuard');
        return super.canActivate(context)
    }
}
