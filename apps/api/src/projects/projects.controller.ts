import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { createProjectSchema, updateProjectSchema } from '@devlab/contracts';
import { createZodDto } from 'nestjs-zod';
import { CurrentDemoUser } from '../identity/current-user.decorator';
import { DemoIdentityGuard } from '../identity/demo-identity.guard';
import type { CurrentUser } from '../identity/identity.types';
import { ProjectsService } from './projects.service';

class CreateProjectDto extends createZodDto(createProjectSchema) {}
class UpdateProjectDto extends createZodDto(updateProjectSchema) {}

@ApiTags('projects')
@ApiSecurity('demo-user')
@UseGuards(DemoIdentityGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  list(@CurrentDemoUser() user: CurrentUser) {
    return this.projectsService.listForUser(user.id);
  }

  @Get(':id')
  getById(@CurrentDemoUser() user: CurrentUser, @Param('id') id: string) {
    return this.projectsService.getByIdForUser(user.id, id);
  }

  @Get(':id/members')
  listMembers(@CurrentDemoUser() user: CurrentUser, @Param('id') id: string) {
    return this.projectsService.listMembers(user.id, id);
  }

  @Post()
  create(@CurrentDemoUser() user: CurrentUser, @Body() body: CreateProjectDto) {
    return this.projectsService.create(user.id, body);
  }

  @Patch(':id')
  update(
    @CurrentDemoUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() body: UpdateProjectDto,
  ) {
    return this.projectsService.update(user.id, id, body);
  }

  @Delete(':id')
  remove(@CurrentDemoUser() user: CurrentUser, @Param('id') id: string) {
    return this.projectsService.remove(user.id, id);
  }
}
