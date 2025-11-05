import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { NewsModule } from './news/news.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';


@Module({
  providers: [PrismaService],
  imports: [UsersModule, NewsModule, AuthModule, CommentsModule],
})
export class AppModule {}
