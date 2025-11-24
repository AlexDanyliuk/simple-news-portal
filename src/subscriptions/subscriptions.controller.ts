import { Controller, Post, Delete, Get, UseGuards, Req, Body, Param } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async subscribe(@Req() req, @Body() body: CreateSubscriptionDto) {
    return this.service.subscribe(req.user.userId, body.topicId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':topicId')
  async unsubscribe(@Req() req, @Param('topicId') topicId: string) {
    return this.service.unsubscribe(req.user.userId, Number(topicId));
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async mySubscriptions(@Req() req) {
    return this.service.getMySubscriptions(req.user.userId);
  }
}
