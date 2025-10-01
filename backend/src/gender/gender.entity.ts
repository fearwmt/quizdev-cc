import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'gender' }) 
export class Gender {
  @PrimaryGeneratedColumn({ name: 'genderid' })
  id: number;

  @Column({ name: 'gendername', type: 'varchar', length: 50 })
  name: string;
}
