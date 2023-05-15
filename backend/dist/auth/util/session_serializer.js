"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSerializer = void 0;
const passport_1 = require("@nestjs/passport");
class SessionSerializer extends passport_1.PassportSerializer {
    constructor(userService) {
        super();
        this.userService = userService;
    }
    serializeUser(user, done) {
        console.log('serializer user');
        done(null, user);
    }
    async deserializeUser(user, done) {
        console.log('deserializer user');
        const userDB = await this.userService.findUsersById(user.id);
        return userDB ? done(null, userDB) : done(null, null);
    }
}
exports.SessionSerializer = SessionSerializer;
//# sourceMappingURL=session_serializer.js.map