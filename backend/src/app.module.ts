import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './database/ormconfig';
import { StudentModule } from './student/student.module';
import { ClassroomModule } from './classroom/classroom.module';
import { PrefixModule } from './prefix/prefix.module'; 
import { GenderModule } from './gender/gender.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    StudentModule,
    ClassroomModule,
    PrefixModule, 
    GenderModule,
  ],
})
export class AppModule {}
