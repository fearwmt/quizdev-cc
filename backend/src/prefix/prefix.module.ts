import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prefix } from './prefix.entity';
import { PrefixService } from './prefix.service';
import { PrefixController } from './prefix.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Prefix])], 
  providers: [PrefixService],
  controllers: [PrefixController],
})
export class PrefixModule {}
