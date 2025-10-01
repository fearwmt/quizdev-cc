import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Classroom } from '../classroom/classroom.entity';

@Entity({ name: 'student' })
export class Student {
  @PrimaryGeneratedColumn({ name: 'studentid' })
  id: number;

  @Column({ name: 'prefixid', type: 'int', nullable: true })
  prefixId: number | null;

  @Column({ name: 'firstname', type: 'varchar', length: 50 })
  firstName: string;

  @Column({ name: 'lastname', type: 'varchar', length: 50 })
  lastName: string;
  
  @Column({ name: 'genderid', type: 'int', nullable: true })  
  genderId: number | null;

  @Column({ name: 'birthdate', type: 'date' })
  birthDate: Date;

  @Column({ name: 'gradelevelid', type: 'int' })
  gradeLevelId: number;

  @ManyToMany(() => Classroom, (classroom) => classroom.students)
  classrooms: Classroom[];

}
