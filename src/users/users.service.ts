// src/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';


@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async createUser(data: { name: string; email: string; password: string }) {
    return this.prisma.user.create({ data });
  }

  

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        favorites: {
          where: {
            news: {
              status: 'PUBLISHED',
            },
          },
          include: {
            news: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      favorites: user.favorites.map((f) => ({
        id: f.news.id,
        title: f.news.title,
        status: f.news.status,
      })),
    };
  }

  async getFavoriteNewsById(userId: number, newsId: number) {
    const favorite = await this.prisma.favorite.findFirst({
      where: {
        userId,
        newsId,
      },
      include: {
        news: true,
      },
    });

    if (!favorite) {
      throw new NotFoundException('This news is not in your favorites');
    }

 
    

    return favorite.news;
  }

  async updateMe(userId: number, dto: UpdateProfileDto) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        avatar: dto.avatar,
      },
    });

    return this.getMe(userId);
  }
}



