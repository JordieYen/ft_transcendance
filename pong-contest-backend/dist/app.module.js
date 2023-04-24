"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const typeorm_2 = require("./typeorm");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (ConfigService) => ({
                    type: 'postgres',
                    host: ConfigService.get('DB_HOST'),
                    port: ConfigService.get('DB_PORT'),
                    username: ConfigService.get('DB_USERNAME'),
                    password: ConfigService.get('DB_PASSWORD'),
                    database: ConfigService.get('DB_NAME'),
                    entities: typeorm_2.default,
                    synchronize: true,
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: 'MY_MODULE_REF',
                useValue: core_1.ModuleRef,
            },
        ],
        exports: ['MY_MODULE_REF', typeorm_1.TypeOrmModule],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map