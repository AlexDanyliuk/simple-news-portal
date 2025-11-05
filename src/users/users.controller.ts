import { Controller, Get, Post,Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll() {
    return this.usersService.getAllUsers();
  }


  @Post()
  async create(@Body() body: {name: string; email: string;password: string}){
    return this.usersService.createUser(body);

  }
}
