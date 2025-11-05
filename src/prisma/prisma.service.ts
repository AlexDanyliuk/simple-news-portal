import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // підключення до БД при старті сервера
  }

  async onModuleDestroy() {
    await this.$disconnect(); // коректне завершення з'єднання
  }
}
