import { Module } from '@nestjs/common';
import { R2Service } from '../../r2/r2.service';
import { HomepageSettingsController, HomepageSlidesController } from './homepage-slides.controller';
import { HomepageSlidesService } from './homepage-slides.service';

@Module({
  controllers: [HomepageSlidesController, HomepageSettingsController],
  providers: [HomepageSlidesService, R2Service],
})
export class HomepageSlidesModule {}
