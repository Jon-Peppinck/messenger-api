import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';

import { Observable, switchMap, catchError } from 'rxjs';

import { UserJwt } from '../interfaces/user-jwt.interface';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    if (ctx.getType() !== 'http') return next.handle();

    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) return next.handle();

    const authHeaderParts = authHeader.split(' ');

    if (authHeaderParts.length !== 2) return next.handle();

    const [, jwt] = authHeaderParts;

    return this.authService.send<UserJwt>({ cmd: 'decode-jwt' }, { jwt }).pipe(
      switchMap(({ user }) => {
        request.user = user;
        return next.handle();
      }),
      catchError(() => next.handle()),
    );
  }
}
