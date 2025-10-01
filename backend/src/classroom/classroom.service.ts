import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from './classroom.entity';
import { Student } from '../student/student.entity';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepo: Repository<Classroom>,

    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  async findAll(): Promise<Classroom[]> {
    return this.classroomRepo.find({ relations: ['students'] });
  }

  async findOne(id: number): Promise<Classroom> {
    const classroom = await this.classroomRepo.findOne({
      where: { id },
      relations: ['students'],
    });
    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }
    return classroom;
  }

  async create(data: Partial<Classroom>): Promise<Classroom> {
    const classroom = this.classroomRepo.create(data);
    return this.classroomRepo.save(classroom);
  }

  async update(id: number, data: Partial<Classroom>): Promise<Classroom> {
    const classroom = await this.findOne(id);
    Object.assign(classroom, data);
    return this.classroomRepo.save(classroom);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const classroom = await this.findOne(id);
    await this.classroomRepo.remove(classroom);
    return { deleted: true };
  }

  async addStudentToClassroom(
    classroomId: number,
    studentId: number,
  ): Promise<Classroom> {
    const classroom = await this.findOne(classroomId);
    const student = await this.studentRepo.findOne({ where: { id: studentId } });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (!classroom.students.some((s) => s.id === student.id)) {
      classroom.students.push(student);
      await this.classroomRepo.save(classroom);
    }

    return this.findOne(classroomId);
  }

  async removeStudentFromClassroom(
    classroomId: number,
    studentId: number,
  ): Promise<Classroom> {
    const classroom = await this.findOne(classroomId);

    const index = classroom.students.findIndex((s) => s.id === studentId);
    if (index === -1) {
      throw new NotFoundException('Student not found in this classroom');
    }

    classroom.students.splice(index, 1);
    await this.classroomRepo.save(classroom);

    return this.findOne(classroomId);
  }
}
