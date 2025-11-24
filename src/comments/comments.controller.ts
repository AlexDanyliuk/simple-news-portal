import { Controller, Post, Get, Delete, Param, Body, UseGuards, Req } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentDto } from "./dto/comment.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('comments')
export class CommentsController{
    constructor(private readonly commentService: CommentsService){}


    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() dto: CommentDto, @Req() req){
        const user = req.user; 
        return this.commentService.create({
            content: dto.content,
            newsId: dto.newsId,
            authorId: user.userId,
        });
    }

    @Get('news/:newsId')
    async getByNews(@Param('newsId') newsId: string){
        return this.commentService.findByNews(Number(newsId))
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteComment(@Param('id') id: string, @Req() req) {
        
        return this.commentService.delete(Number(id), req.user);
  }
}