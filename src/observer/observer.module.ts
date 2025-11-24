import { Module, OnModuleInit } from '@nestjs/common';
import { ObserverService } from './observer.service';
import { NotificationObserver } from './notification.observer';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ObserverService, NotificationObserver, PrismaService],
  exports: [ObserverService],
})
export class ObserverModule implements OnModuleInit {
  constructor(
    private observer: ObserverService,
    private notificationObserver: NotificationObserver,
  ) {}

  onModuleInit() {
    this.observer.subscribe(this.notificationObserver);
  }
}
