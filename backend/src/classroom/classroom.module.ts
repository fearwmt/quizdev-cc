import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom } from './classroom.entity';
import { Student } from '../student/student.entity';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Classroom, Student])],
  providers: [ClassroomService],
  controllers: [ClassroomController],
})
export class ClassroomModule {}
