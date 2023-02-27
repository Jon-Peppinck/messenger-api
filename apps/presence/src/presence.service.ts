import { Injectable } from '@nestjs/common';

@Injectable()
export class PresenceService {
  getFoo() {
    console.log('NOT CACHED!');
    return { foo: 'bar' };
  }
}
