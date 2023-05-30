import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/user.entity';
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';
import { diskStorage } from 'multer';
import { StatService } from 'src/stat/services/stat.service';
import { Stat } from 'src/typeorm/stats.entity';
import { MatchHistory } from 'src/typeorm/match_history.entity';
import { MatchHistoryService } from 'src/match-history/services/match-history.service';
import { Friend } from 'src/typeorm/friends.entity';

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

})
export class UsersModule {}
