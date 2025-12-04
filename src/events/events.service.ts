import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { EventFilterInput } from './dto/event-filter.input';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateEventInput) {
    return this.prisma.event.create({
      data: {
        host: input.host,
        eventName: input.eventName,
        url: input.url,
        date: this.toDate(input.date),
        properties: this.normalizeProperties(input.properties),
      },
    });
  }

  findAll(filter?: EventFilterInput) {
    return this.prisma.event.findMany({
      where: this.buildWhere(filter),
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async update(id: string, input: UpdateEventInput) {
    const data: Prisma.EventUpdateInput = {};

    if (input.host !== undefined) {
      data.host = input.host;
    }

    if (input.eventName !== undefined) {
      data.eventName = input.eventName;
    }

    if (input.url !== undefined) {
      data.url = input.url;
    }

    if (input.date !== undefined) {
      data.date = this.toDate(input.date);
    }

    if (input.properties !== undefined) {
      data.properties = this.normalizeProperties(input.properties);
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields provided for update');
    }

    try {
      return await this.prisma.event.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException('Event not found');
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.prisma.event.delete({ where: { id } });
      return true;
    } catch {
      throw new NotFoundException('Event not found');
    }
  }

  private buildWhere(filter?: EventFilterInput): Prisma.EventWhereInput {
    if (!filter) {
      return {};
    }

    const where: Prisma.EventWhereInput = {};

    if (filter.host) {
      where.host = filter.host;
    }

    if (filter.eventName) {
      where.eventName = filter.eventName;
    }

    if (filter.fromDate || filter.toDate) {
      const dateFilter: Prisma.DateTimeFilter = {};
      if (filter.fromDate) {
        dateFilter.gte = this.toDate(filter.fromDate);
      }
      if (filter.toDate) {
        dateFilter.lte = this.toDate(filter.toDate);
      }
      where.date = dateFilter;
    }

    return where;
  }

  private normalizeProperties(value?: string): string {
    if (!value) {
      return '{}';
    }

    try {
      JSON.parse(value);
      return value;
    } catch {
      throw new BadRequestException('Properties must be a valid JSON string');
    }
  }

  private toDate(value: string): Date {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date value');
    }
    return date;
  }
}

