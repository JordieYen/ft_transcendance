"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const session = require("express-session");
const config_1 = require("@nestjs/config");
const swagger_config_1 = require("./swagger.config");
const passport = require("passport");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: `${process.env.NEXT_HOST}`,
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        credentials: true,
    });
    (0, swagger_config_1.setupSwagger)(app);
    app.use(session({
        name: 'shawn_session_id',
        secret: configService.get('CLIENT_SECRET'),
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 600000,
        },
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req, res, next) => {
        req.user = req.session.user;
        next();
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map