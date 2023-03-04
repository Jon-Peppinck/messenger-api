import { CacheModule, Module } from '@nestjs/common';

import { SharedModule } from '@app/shared';

import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import { PresenceGateway } from './presence.gateway';

@Module({
  imports: [
    CacheModule.register(),
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
  ],
  controllers: [PresenceController],
  providers: [PresenceService, PresenceGateway],
})
export class PresenceModule {}
