import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './student.entity';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.studentService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Student>) {
    return this.studentService.create(data);
  }

  @Put(':id')   
  update(@Param('id') id: number, @Body() data: Partial<Student>) {
    return this.studentService.update(id, data);
  }

  @Delete(':id')  
  remove(@Param('id') id: number) {
    return this.studentService.remove(id);
  }
}
