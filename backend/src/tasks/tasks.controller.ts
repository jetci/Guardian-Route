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
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, TaskStatus } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
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

  @Get('statistics')
  @ApiOperation({ summary: 'Get task statistics' })
  getStatistics() {
    return this.tasksService.getStatistics();
  }

  @Get('my-tasks')
  @ApiOperation({ summary: 'Get tasks assigned to current user' })
  getMyTasks(@CurrentUser() user: any, @Query('status') status?: TaskStatus) {
    return this.tasksService.findAll({
      assignedToId: user.sub,
      status,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
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
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.remove(id, user.role);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept a task (Field Officer)' })
  acceptTask(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tasksService.update(
      id,
      { status: 'IN_PROGRESS' as TaskStatus },
      user.sub,
      user.role,
    );
  }

  @Post(':id/survey')
  @ApiOperation({ summary: 'Submit survey data for a task' })
  submitSurvey(
    @Param('id') id: string,
    @Body() surveyData: any,
    @CurrentUser() user: any,
  ) {
    return this.tasksService.update(
      id,
      {
        surveyLocation: surveyData.surveyLocation,
        surveyArea: surveyData.surveyArea,
        surveyNotes: surveyData.surveyNotes,
        surveyPhotos: surveyData.surveyPhotos,
        status: 'COMPLETED' as TaskStatus,
      },
      user.sub,
      user.role,
    );
  }
}
