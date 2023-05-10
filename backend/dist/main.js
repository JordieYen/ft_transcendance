"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const session = require("express-session");
const randomstring_1 = require("randomstring");
const config_1 = require("@nestjs/config");
const swagger_config_1 = require("./swagger.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
        credentials: true,
    });
    (0, swagger_config_1.setupSwagger)(app);
    app.use(session({
        secret: configService.get('CLIENT_SECRET'),
        resave: false,
        saveUninitialized: false,
        genid: () => {
            const sessionId = (0, randomstring_1.generate)({ length: 10, charset: 'alphanumeric' });
            return (sessionId);
        }
    }));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map