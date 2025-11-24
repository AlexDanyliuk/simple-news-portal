import { Injectable } from '@nestjs/common';
import { Observer } from './observer.interface';

@Injectable()
export class ObserverService {
  private observers: Observer[] = [];

  subscribe(observer: Observer) {
    this.observers.push(observer);
  }

  notify(event: string, data: any) {
    for (const obs of this.observers) {
      obs.update(event, data);
    }
  }
}
