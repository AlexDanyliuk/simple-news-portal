import { Controller, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':newsId')
  async add(
    @Req() req,
    @Param('newsId') newsId: string
  ) {
    return this.favoritesService.addToFavorites(req.user.userId, Number(newsId));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':newsId')
  async remove(
    @Req() req,
    @Param('newsId') newsId: string
  ) {
    return this.favoritesService.removeFromFavorites(req.user.userId, Number(newsId));
  }
}
