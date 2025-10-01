import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'prefix' }) 
export class Prefix {
  @PrimaryGeneratedColumn({ name: 'prefixid' })
  id: number;

  @Column({ name: 'prefixname', type: 'varchar', length: 50 })
  name: string;
}
