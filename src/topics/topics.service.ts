import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTopicDto } from '../dto/create-topic.dto';

@Injectable()
export class TopicsService {
  constructor(private prisma: PrismaService) {}

  // Для всіх (юзер + гість)
  async getAll() {
    return this.prisma.topic.findMany();
  }

  // Для адміна — створення категорії
  async create(dto: CreateTopicDto) {
    return this.prisma.topic.create({
      data: dto,
    });
  }

  // Для адміна — оновлення
  async update(id: number, dto: CreateTopicDto) {
    const exists = await this.prisma.topic.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Topic not found');

    return this.prisma.topic.update({
      where: { id },
      data: dto,
    });
  }

  // Для адміна — видалення
  async delete(id: number) {
    const exists = await this.prisma.topic.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Topic not found');

    return this.prisma.topic.delete({ where: { id } });
  }

  // Для всіх — новини за категорією
  async getNewsByTopic(topicId: number) {
    return this.prisma.news.findMany({
      where: { topicId, status: 'PUBLISHED' },
      include: {
        author: { select: { email: true } },
        topic: true,
      },
    });
  }
}
