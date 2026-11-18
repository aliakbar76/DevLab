import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { createTaskSchema, updateTaskSchema } from '@devlab/contracts';
import { createZodDto } from 'nestjs-zod';
import { CurrentDemoUser } from '../identity/current-user.decorator';
import { DemoIdentityGuard } from '../identity/demo-identity.guard';
import type { CurrentUser } from '../identity/identity.types';
import { TasksService } from './tasks.service';

class CreateTaskDto extends createZodDto(createTaskSchema) {}
class UpdateTaskDto extends createZodDto(updateTaskSchema) {}

@ApiTags('tasks')
@ApiSecurity('demo-user')
@UseGuards(DemoIdentityGuard)
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('projects/:projectId/tasks')
  listForProject(
    @CurrentDemoUser() user: CurrentUser,
    @Param('projectId') projectId: string,
  ) {
    return this.tasksService.listForProject(user.id, projectId);
  }

  @Post('projects/:projectId/tasks')
  create(
    @CurrentDemoUser() user: CurrentUser,
    @Param('projectId') projectId: string,
    @Body() body: CreateTaskDto,
  ) {
    return this.tasksService.create(user.id, projectId, body);
  }

  @Get('tasks/:id')
  getById(@CurrentDemoUser() user: CurrentUser, @Param('id') id: string) {
    return this.tasksService.getByIdForUser(user.id, id);
  }

  @Patch('tasks/:id')
  update(
    @CurrentDemoUser() user: CurrentUser,
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.id, id, body);
  }

  @Delete('tasks/:id')
  remove(@CurrentDemoUser() user: CurrentUser, @Param('id') id: string) {
    return this.tasksService.remove(user.id, id);
  }
}
