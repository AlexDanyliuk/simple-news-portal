import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { ObserverModule } from '../observer/observer.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    imports: [ObserverModule],
  providers: [NewsService, PrismaService],
  controllers: [NewsController]
})
export class NewsModule {}
