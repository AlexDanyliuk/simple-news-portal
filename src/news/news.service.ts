import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.news.findMany({
       include:{
                author:{
                    select:{
                        id: true,
                        name:true,
                        email:true
                    }
                }
            },
    });
  }

  async create(data: { title: string; content: string; topicId: number; authorId: number }) {
    return this.prisma.news.create({
      data: {
        title: data.title,
        content: data.content,
        topic: { connect: { id: data.topicId } },
        author: { connect: { id: data.authorId } },
      },
    });
  }

  async getById(id: number) {
    return this.prisma.news.findUnique({ where: { id } });
  }




  async update(id: number, data: {title?: string; content?: string; status?: string; topicId?: number}){
    const exists = await this.prisma.news.findUnique({where: {id}});
    if (!exists) throw new NotFoundException(`News with Id ${id} not found`);

    return this.prisma.news.update({
        where: {id},
        data: {
            title: data.title,
            content: data.content,
            status: data.status as any,
            topicId: data.topicId,
        },
    });
  }



  async delete(id: number){
    const exists = await this.prisma.news.findUnique({where: {id}});
    if (!exists) throw new NotFoundException(`News with ID ${id} not found`);


    await this.prisma.comment.deleteMany({
        where: {newsId: id},
    });
    return this.prisma.news.delete({where: {id}});
    
  }
}
