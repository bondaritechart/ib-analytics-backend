import { Body, Controller, Post } from '@nestjs/common';
import { EventsService } from './events.service';

type CreateEventRequest = {
  host: string;
  eventName: string;
  url: string;
  properties?: string | null;
};

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('add-event')
  addEvent(@Body() body: CreateEventRequest) {
    return this.eventsService.create(body);
  }
}
