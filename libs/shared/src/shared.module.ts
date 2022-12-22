import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthGuard } from './auth.guard';

import { SharedService } from './shared.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    // SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
  ],
  providers: [SharedService, AuthGuard],
  exports: [SharedService, AuthGuard],
})
export class SharedModule {
  static registerRmq(service: string, queue: string): DynamicModule {
    return {
      module: SharedModule,
      providers: [
        {
          provide: service,
          useFactory: (configService: ConfigService) => {
            const USER = configService.get('RABBITMQ_USER');
            const PASSWORD = configService.get('RABBITMQ_PASS');
            const HOST = configService.get('RABBITMQ_HOST');

            return ClientProxyFactory.create({
              transport: Transport.RMQ,
              options: {
                urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
                queue,
                queueOptions: {
                  durable: true, // queue survives broker restart
                },
              },
            });
          },
          inject: [ConfigService],
        },
      ],
    };
  }
}
