import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/user.entity';
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MatchHistoryModule } from 'src/match-history/match-history.module';

const storageOptions: MulterModuleOptions = {
    storage: diskStorage({
        destination: './public/avatar',
        filename: (req, file, callback) => {
            const originalname = file.originalname;
            callback(null, originalname);
        },
    }),
};

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        MulterModule.register(storageOptions),
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
    ],
    exports: [
        UsersService,
        TypeOrmModule,
    ]

})
export class UsersModule {}
