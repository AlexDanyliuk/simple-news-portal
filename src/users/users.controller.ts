// src/users/users.controller.ts

import { Controller, Get, Post, Body,Patch, UseGuards, Req, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProfileDto } from '../dto/update-profile.dto';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll() {
    return this.usersService.getAllUsers();
  }

  @Post()
  async create(@Body() body: { name: string; email: string; password: string }) {
    return this.usersService.createUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    return this.usersService.getMe(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/favorites/:newsId')
  async getFavoriteNews(
    @Req() req,
    @Param('newsId') newsId: string
  ) {
    return this.usersService.getFavoriteNewsById(
      req.user.userId,
      Number(newsId),
    );
  }

   @UseGuards(JwtAuthGuard)
   @Patch('me')
  async updateMe(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateMe(req.user.userId, dto);
  }



}
