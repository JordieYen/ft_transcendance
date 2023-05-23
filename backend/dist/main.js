"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const ExpressSession = require("express-session");
const swagger_config_1 = require("./swagger.config");
const passport = require("passport");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const pg = require("pg");
const connectPgSimple = require("connect-pg-simple");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.NEXT_HOST,
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
    const pgPool = new pg.Pool({
        host: process.env.DB_HOST,
        port: 5432,
        database: process.env.DB_USER,
        user: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
    });
    const pgSessionStore = connectPgSimple(ExpressSession);
    const sessionStore = new pgSessionStore({
        pool: pgPool,
        createTableIfMissing: true,
    });
    const sessionOption = ExpressSession({
        name: 'ft_transcendence_session_id',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 1 * 24 * 60 * 60 * 100,
        },
        store: sessionStore,
    });
    app.use(sessionOption);
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req, res, next) => {
        var status = req.isAuthenticated() ? 'logged in' : 'logged out';
        console.log('status:', status, '\n', 'path', req.path, '\n');
        next();
    });
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map