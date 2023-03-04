import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

import { SharedService } from '@app/shared';

@Controller()
export class PresenceController {
  constructor(private readonly sharedService: SharedService) {}

  @MessagePattern({ cmd: 'get-presence' })
  async getFoo(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context);

    return { foo: 1 };
  }
}
