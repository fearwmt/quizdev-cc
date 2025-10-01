import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Student } from '../student/student.entity';

@Entity({ name: 'classroom' })
export class Classroom {
  @PrimaryGeneratedColumn({ name: 'classroomid' })
  id: number;

  @Column({ name: 'academic_year', type: 'year' })
  academicYear: number;

  @Column({ name: 'homeroom_teacher', type: 'varchar', length: 100 })
  homeroomTeacher: string;

  @ManyToMany(() => Student, (student) => student.classrooms)
  @JoinTable({
    name: 'student_classroom', 
    joinColumn: {
      name: 'classroomid',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'studentid',
      referencedColumnName: 'id',
    },
  })
  students: Student[];
}
