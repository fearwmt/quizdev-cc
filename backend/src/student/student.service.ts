import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly repo: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.repo.find({ relations: ['classrooms'] });
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.repo.findOne({ where: { id }, relations: ['classrooms'] });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async create(data: Partial<Student>): Promise<Student> {
    const student = this.repo.create(data);
    return this.repo.save(student);
  }

  async update(id: number, data: Partial<Student>): Promise<Student> {
    const student = await this.findOne(id);
    Object.assign(student, data);
    return this.repo.save(student);
  }

  async remove(id: number) {
    const student = await this.findOne(id);
    return this.repo.remove(student);  
  }
}
