"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const typeorm_2 = require("../typeorm");
let DatabaseModule = class DatabaseModule {
    constructor(configService) {
        this.configService = configService;
        const dbHost = this.configService.get('DB_HOST');
        const dbDatabase = this.configService.get('DB_NAME');
        const dbPassword = this.configService.get('DB_PASSWORD');
        const dbPort = this.configService.get('DB_PORT');
        const dbName = this.configService.get('DB_USER');
        console.log(`DB_HOST: ${dbHost}`);
        console.log(`DB_NAME: ${dbDatabase}`);
        console.log(`DB_PASSWORD: ${dbPassword}`);
        console.log(`DB_PORT: ${dbPort}`);
        console.log(`DB_USER: ${dbName}`);
    }
};
DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (ConfigService) => ({
                    type: 'postgres',
                    host: ConfigService.get('DB_HOST'),
                    port: ConfigService.get('DB_PORT'),
                    username: ConfigService.get('DB_USER'),
                    password: ConfigService.get('DB_PASSWORD'),
                    database: ConfigService.get('DB_NAME'),
                    entities: typeorm_2.default,
                    autoLoadEntities: true,
                    synchronize: true,
                }),
            }),
        ],
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseModule);
exports.DatabaseModule = DatabaseModule;
//# sourceMappingURL=database.module.js.map