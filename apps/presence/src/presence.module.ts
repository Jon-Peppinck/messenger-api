import { Module } from '@nestjs/common';

import { RedisModule, SharedModule } from '@app/shared';

import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';

@Module({
  imports: [SharedModule, RedisModule],
  controllers: [PresenceController],
  providers: [PresenceService],
})
export class PresenceModule {}
