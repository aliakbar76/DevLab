import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { CurrentUser } from './identity.types';

export const CurrentDemoUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUser => {
    const request = ctx.switchToHttp().getRequest<{ user?: CurrentUser }>();
    if (!request.user) {
      throw new Error('CurrentDemoUser used without DemoIdentityGuard');
    }
    return request.user;
  },
);
