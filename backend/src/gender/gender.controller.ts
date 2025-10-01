import { Controller, Get } from '@nestjs/common';
import { GenderService } from './gender.service';
import { Gender } from './gender.entity';

@Controller('genders')
export class GenderController {
  constructor(private readonly genderService: GenderService) {}

  @Get()
  async findAll(): Promise<Gender[]> {
    return this.genderService.findAll();
  }
}
