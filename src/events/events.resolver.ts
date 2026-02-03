import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventInput, EventFilterInput, UpdateEventInput } from '../graphql';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';

@Resolver('Event')
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query('events')
  @UseGuards(GqlAuthGuard)
  events(@Args('filter', { nullable: true }) filter?: EventFilterInput) {
    return this.eventsService.findAll(filter);
  }

  @Query('event')
  @UseGuards(GqlAuthGuard)
  event(@Args('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Mutation('createEvent')
  @UseGuards(GqlAuthGuard)
  createEvent(@Args('input') input: CreateEventInput) {
    return this.eventsService.create(input);
  }

  @Mutation('updateEvent')
  @UseGuards(GqlAuthGuard)
  updateEvent(@Args('id') id: string, @Args('input') input: UpdateEventInput) {
    return this.eventsService.update(id, input);
  }

  @Mutation('deleteEvent')
  @UseGuards(GqlAuthGuard)
  deleteEvent(@Args('id') id: string) {
    return this.eventsService.remove(id);
  }
}

