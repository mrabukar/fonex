import { Module } from '@nestjs/common';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { R2Service } from '../../r2/r2.service';

@Module({
  controllers: [PartnersController],
  providers: [PartnersService, R2Service],
})
export class PartnersModule {}
