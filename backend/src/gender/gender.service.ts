import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gender } from './gender.entity';

@Injectable()
export class GenderService {
  constructor(
    @InjectRepository(Gender)
    private readonly genderRepo: Repository<Gender>,
  ) {}

  async findAll(): Promise<Gender[]> {
    return this.genderRepo.find();
  }
}
