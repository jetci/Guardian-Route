import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, TaskStatus } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateSurveyDataDto } from './dto/update-survey-data.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERVISOR, Role.EXECUTIVE, Role.ADMIN)
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.create(createTaskDto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with optional filters' })
  findAll(
    @Query('status') status?: TaskStatus,
    @Query('priority') priority?: string,
    @Query('incidentId') incidentId?: string,
    @Query('assignedToId') assignedToId?: string,
  ) {
    return this.tasksService.findAll({
      status,
      priority,
      incidentId,
      assignedToId,
    });
  }

  @Get('my-tasks')
  @ApiOperation({ summary: 'Get tasks assigned to current user' })
  @ApiResponse({ status: 200, description: 'Returns tasks assigned to current user' })
  getMyTasks(@CurrentUser() user: any, @Query('status') status?: TaskStatus) {
    return this.tasksService.getMyTasks(user.sub, status);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get task statistics' })
  getStatistics() {
    return this.tasksService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept a task (Field Officer)' })
  @ApiResponse({ status: 200, description: 'Task accepted and status changed to IN_PROGRESS' })
  @ApiResponse({ status: 403, description: 'Not assigned to this task' })
  @ApiResponse({ status: 400, description: 'Task is not in PENDING status' })
  @UseGuards(RolesGuard)
  @Roles(Role.FIELD_OFFICER, Role.SUPERVISOR, Role.ADMIN)
  acceptTask(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.acceptTask(id, user.sub);
  }

  @Post(':id/survey')
  @ApiOperation({ summary: 'Submit field survey data' })
  @ApiResponse({ status: 200, description: 'Survey data submitted and status changed to SURVEYED' })
  @ApiResponse({ status: 403, description: 'Not assigned to this task' })
  @ApiResponse({ status: 400, description: 'Task is not in IN_PROGRESS status' })
  @UseGuards(RolesGuard)
  @Roles(Role.FIELD_OFFICER, Role.SUPERVISOR, Role.ADMIN)
  submitSurveyData(
    @Param('id') id: string,
    @Body() surveyData: UpdateSurveyDataDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.updateSurveyData(id, user.sub, surveyData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.update(id, updateTaskDto, user.sub, user.role);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task (Admin only)' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.remove(id, user.role);
  }
}
