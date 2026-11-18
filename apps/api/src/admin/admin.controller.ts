import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { DemoIdentityGuard } from '../identity/demo-identity.guard';
import { AdminService } from './admin.service';

@ApiTags('admin')
@ApiSecurity('demo-user')
@UseGuards(DemoIdentityGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('projects')
  listProjects() {
    return this.adminService.listAllProjects();
  }

  @Get('tasks')
  listTasks() {
    return this.adminService.listAllTasks();
  }
}
