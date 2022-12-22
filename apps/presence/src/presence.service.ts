import { Injectable } from '@nestjs/common';

@Injectable()
export class PresenceService {
  getHello(): string {
    return 'Hello World!';
  }
}
