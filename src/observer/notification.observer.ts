import { Injectable } from '@nestjs/common';
import { Observer } from './observer.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationObserver implements Observer {
  constructor(private prisma: PrismaService) {}

  async update(event: string, data: any) {
    if (event !== 'news_published') return;

    const news = data;

    // знайти всіх юзерів, що підписані на тему
    const subscribers = await this.prisma.subscription.findMany({
      where: { topicId: news.topicId },
      include: { user: true },
    });

    // створити нотифікації для кожного підписника
    for (const sub of subscribers) {
      await this.prisma.notification.create({
        data: {
          userId: sub.userId,
          newsId: news.id,
          message: `Нова новина у темі, на яку ви підписані: ${news.title}`,
        },
      });
    }
  }
}
