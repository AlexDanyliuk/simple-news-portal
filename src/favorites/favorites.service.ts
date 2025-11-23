import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async addToFavorites(userId: number, newsId: number) {
    // перевіряємо чи новина існує
    const news = await this.prisma.news.findUnique({ where: { id: newsId }});
    if (!news) throw new NotFoundException('News not found');

    // перевіряємо чи вже є в улюблених
    const exists = await this.prisma.favorite.findFirst({
      where: { userId, newsId },
    });
    if (exists) throw new BadRequestException('Already in favorites');

    return this.prisma.favorite.create({
      data: { userId, newsId }
    });
  }

  async removeFromFavorites(userId: number, newsId: number) {
    const exists = await this.prisma.favorite.findFirst({
      where: { userId, newsId },
    });

    if (!exists) {
      throw new NotFoundException('This news is not in favorites');
    }

    return this.prisma.favorite.delete({
      where: { id: exists.id }
    });
  }
}
