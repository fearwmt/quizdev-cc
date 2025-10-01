import { Controller, Get } from '@nestjs/common';
import { PrefixService } from './prefix.service';

@Controller('prefixes')
export class PrefixController {
  constructor(private readonly prefixService: PrefixService) {}

  @Get()
  findAll() {
    return this.prefixService.findAll();
  }
}
