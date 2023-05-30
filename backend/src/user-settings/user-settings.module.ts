import { Module } from '@nestjs/common';
import { UserSettingsController } from './controllers/user-settings.controller';
import { UserSettingsService } from './services/user-settings.service';

@Module({
  controllers: [UserSettingsController],
  providers: [UserSettingsService]
})
export class UserSettingsModule {
	constructor(private readonly userSettingsService: UserSettingsService) {}
}
