import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard {
  hasJwt() {
    return { jwt: 'token' };
  }
}
