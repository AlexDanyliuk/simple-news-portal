import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CommentDto } from "./dto/comment.dto";

@Injectable()

export class CommentsService{
    constructor(private prisma: PrismaService){}

    async create(data: CommentDto){
        return this.prisma.comment.create({
            data: {
                content: data.content,
                author: {connect: {id: data.authorId}},
                news: {connect: {id: data.newsId}},
            },
        });
    }

    async findByNews(newsId: number){
        return this.prisma.comment.findMany({
            where: {newsId},
            include:{
                author:{
                    select:{
                        id: true,
                        name:true,
                        email:true
                    }
                }
            },
            orderBy: {createdAt: 'desc'},
        });
    }
}