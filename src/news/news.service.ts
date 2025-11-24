import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NewsStatus } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';
import { ObserverService } from '../observer/observer.service';  



@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService,   private observer: ObserverService,
) {}

  async getAll(role: string) {
    const isAdmin = role === 'ADMIN';

    const news = await this.prisma.news.findMany({
      where: isAdmin ? {} : { status: 'PUBLISHED' },
      include: {
        author: {
          select: { email: true },
        },
          topic: { select: { name: true } }

      },
    });

    return news.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      status: n.status,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
      topicId: n.topicId,
      category: n.topic?.name,
      author: n.author?.email,
    }));
  }

  async getById(id: number, role: string) {
    const isAdmin = role === 'ADMIN';

    const news = await this.prisma.news.findUnique({
      where: { id },
      include: {
        author: { select: { email: true } },
        topic: { select: { name: true } }

      },
    });

    if (!news) throw new NotFoundException('News not found');

    if (news.status === 'DRAFT' && !isAdmin) {
      throw new ForbiddenException('You cannot access draft news');
    }

    return {
      id: news.id,
      title: news.title,
      content: news.content,
      status: news.status,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
      topicId: news.topicId,
      category: news.topic?.name,
      author: news.author?.email,
    };
  }

  async create(data: { title: string; content: string; topicId: number; authorId: number }) {
    return this.prisma.news.create({
      data: {
        title: data.title,
        content: data.content,
        topic: { connect: { id: data.topicId } },
        author: { connect: { id: data.authorId } },
      },
    });
  }

  async update(id: number, data: any) {
  const oldNews = await this.prisma.news.findUnique({ where: { id } });
  if (!oldNews) throw new NotFoundException(`News with ID ${id} not found`);

  const updatedNews = await this.prisma.news.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      status: data.status as any,
      topicId: data.topicId,
    },
  });

  if (oldNews.status === 'DRAFT' && updatedNews.status === 'PUBLISHED') {
    this.observer.notify('news_published', updatedNews);
  }

  return updatedNews;
}


  async delete(id: number) {
    const exists = await this.prisma.news.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`News with ID ${id} not found`);

    await this.prisma.comment.deleteMany({ where: { newsId: id } });

    return this.prisma.news.delete({ where: { id } });
  }
}