import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async subscribe(userId: number, topicId: number) {
    // чи вже існує підписка?
    const exists = await this.prisma.subscription.findFirst({
      where: { userId, topicId },
    });

    if (exists) {
      throw new ForbiddenException('Already subscribed to this topic');
    }

    return this.prisma.subscription.create({
      data: {
        userId,
        topicId,
      },
    });
  }

  async unsubscribe(userId: number, topicId: number) {
    return this.prisma.subscription.deleteMany({
      where: { userId, topicId },
    });
  }

  async getMySubscriptions(userId: number) {
    return this.prisma.subscription.findMany({
      where: { userId },
      include: {
        topic: true,
      },
    });
  }
}
