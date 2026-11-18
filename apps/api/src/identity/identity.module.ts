import { Global, Module } from '@nestjs/common';
import { DemoIdentityAdapter } from './demo-identity.adapter';
import { DemoIdentityGuard } from './demo-identity.guard';
import { IDENTITY_RESOLVER } from './identity.types';

@Global()
@Module({
  providers: [
    DemoIdentityAdapter,
    DemoIdentityGuard,
    {
      provide: IDENTITY_RESOLVER,
      useExisting: DemoIdentityAdapter,
    },
  ],
  exports: [IDENTITY_RESOLVER, DemoIdentityGuard],
})
export class IdentityModule {}
