import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { SharedService } from '@app/shared';

import { PresenceModule } from './presence.module';

async function bootstrap() {
  const app = await NestFactory.create(PresenceModule);
  app.enableCors();

  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const queue = configService.get('RABBITMQ_PRESENCE_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(queue));
  await app.startAllMicroservices();

  await app.listen(6000);
}
bootstrap();
