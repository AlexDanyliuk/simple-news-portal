import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { read } from 'fs';


@Controller('news')
export class NewsController {

    constructor(private readonly newsService: NewsService){}

    @Get()
    async getCallSites(){
        return this.newsService.getAll();
    }

    @Get(':id')
    async getById(@Param('id') id:string){
        return this.newsService.getById(Number(id));
    }



    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post()
    async create(
        @Body() body:{title: string; content: string; topicId: number; authorId: number},

    ){
        return this.newsService.create(body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: {title?: string; content?: string; status?: string; topicId?: number}){
        return this.newsService.update(Number(id), body);

    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':id')
    async delete(@Param('id') id: string){
        return this.newsService.delete(Number(id));
    }

}
