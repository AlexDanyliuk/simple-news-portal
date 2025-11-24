// src/users/users.controller.ts

import { Controller, Get, Post, Body,Patch, UseGuards, Req, Param } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ForbiddenException } from '@nestjs/common';







@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: Role }, 
    @Req() req
  ) {
  if (req.user.userId === Number(id)) {
    throw new ForbiddenException('You cannot change your own role');
  }

  return this.usersService.updateRole(Number(id), body.role);
}


}
