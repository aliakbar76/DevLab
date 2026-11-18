import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { IDENTITY_RESOLVER, type CurrentUser, type IdentityResolver } from './identity.types';

@Injectable()
export class DemoIdentityGuard implements CanActivate {
  constructor(
    @Inject(IDENTITY_RESOLVER) private readonly identityResolver: IdentityResolver,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
      user?: CurrentUser;
    }>();

    request.user = await this.identityResolver.resolveFromRequest(request.headers);
    return true;
  }
}
