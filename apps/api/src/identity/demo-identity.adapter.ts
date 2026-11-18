import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DEMO_USER_HEADER } from '@devlab/contracts';
import { PrismaService } from '../prisma/prisma.service';
import type { CurrentUser, IdentityResolver } from './identity.types';

/**
 * Development-only identity fixture.
 * Not authentication. Not secure. Not for production.
 */
@Injectable()
export class DemoIdentityAdapter implements IdentityResolver {
  constructor(private readonly prisma: PrismaService) {}

  async resolveFromRequest(
    headers: Record<string, string | string[] | undefined>,
  ): Promise<CurrentUser> {
    const raw = headers[DEMO_USER_HEADER] ?? headers[DEMO_USER_HEADER.toUpperCase()];
    const userId = Array.isArray(raw) ? raw[0] : raw;

    if (!userId) {
      throw new UnauthorizedException(
        `Missing ${DEMO_USER_HEADER} header. Select a demo user in the local UI.`,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Unknown demo user id.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
