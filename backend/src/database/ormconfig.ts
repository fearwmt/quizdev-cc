import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Student } from '../student/student.entity';
import { Classroom } from '../classroom/classroom.entity';
import { Prefix } from '../prefix/prefix.entity';
import { Gender } from '../gender/gender.entity';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'node53939-belusysdb-1.th1.proen.cloud',
  port: 11320,
  username: 'quizdev_cc',
  password: 'b)DwBGMv(wrDLrru',
  database: 'quizdev_cc',
  entities: [Student, Classroom, Prefix, Gender],
  synchronize: false,
};

export default config;
