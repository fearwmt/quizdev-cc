import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { Classroom } from './classroom.entity';

@Controller('classrooms')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get()
  getAll(): Promise<Classroom[]> {
    return this.classroomService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<Classroom> {
    return this.classroomService.findOne(id);
  }

  @Post()
  create(@Body() body: Partial<Classroom>): Promise<Classroom> {
    return this.classroomService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<Classroom>,
  ): Promise<Classroom> {
    return this.classroomService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ deleted: boolean }> {
    return this.classroomService.remove(id);
  }

  @Post(':id/students/:studentId')
  async addStudentToClassroom(
    @Param('id', ParseIntPipe) classroomId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ): Promise<Classroom> {
    return this.classroomService.addStudentToClassroom(classroomId, studentId);
  }

  @Delete(':id/students/:studentId')
  async removeStudentFromClassroom(
    @Param('id', ParseIntPipe) classroomId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ): Promise<Classroom> {
    return this.classroomService.removeStudentFromClassroom(
      classroomId,
      studentId,
    );
  }
}
