import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { DemoIdentityGuard } from '../identity/demo-identity.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiSecurity('demo-user')
@UseGuards(DemoIdentityGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list() {
    return this.usersService.list();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.usersService.getById(id);
  }
}
