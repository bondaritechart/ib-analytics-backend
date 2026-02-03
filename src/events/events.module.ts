import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { EventsController } from './events.controller';

@Module({
  providers: [EventsService, EventsResolver],
  controllers: [EventsController],
})
export class EventsModule {}

