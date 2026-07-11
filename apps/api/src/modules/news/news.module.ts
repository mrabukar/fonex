import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { R2Service } from '../../r2/r2.service';

@Module({
  controllers: [NewsController],
  providers: [NewsService, R2Service],
})
export class NewsModule {}
