import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { NewsService } from './news.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';



@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getAll(@Req() req) {
    const role = req.user?.role || 'GUEST';
    return this.newsService.getAll(role);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string, @Req() req) {
    const role = req.user?.role ?? 'GUEST';
  return this.newsService.getById(Number(id), role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Req() req, @Body() body: { title: string; content: string; topicId: number }) {
    return this.newsService.create({
      ...body,
      authorId: req.user.userId,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { title?: string; content?: string; status?: string; topicId?: number },
  ) {
    return this.newsService.update(Number(id), body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.newsService.delete(Number(id));
  }
}