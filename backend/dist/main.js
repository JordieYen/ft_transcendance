"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const session = require("express-session");
const config_1 = require("@nestjs/config");
const swagger_config_1 = require("./swagger.config");
const passport = require("passport");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const session_entity_1 = require("./typeorm/session.entity");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: `${process.env.NEXT_HOST}`,
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        credentials: true,
    });
    (0, swagger_config_1.setupSwagger)(app);
    app.useGlobalPipes(new common_1.ValidationPipe(({
        whitelist: true,
    })));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'), {
        index: false,
        prefix: '/public',
    });
    const sessionRepo = app.get(typeorm_1.DataSource).getRepository(session_entity_1.SessionEntity);
    const secret = configService.get('CLIENT_SECRET');
    const sessionMiddleware = session({
        name: 'ft_transcendence_session_id',
        secret: secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 600000,
        },
    });
    app.use(sessionMiddleware);
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req, res, next) => {
        req.session.user = req.user;
        next();
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map