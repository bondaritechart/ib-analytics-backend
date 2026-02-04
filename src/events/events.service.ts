import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateEventInput,
  EventFilterInput,
  UpdateEventInput,
} from '../graphql';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateEventInput) {
    const data = {
      host: input.host,
      eventName: input.eventName,
      url: input.url,
      userUuid: String(input.userUuid),
      location: input.location == null ? undefined : String(input.location),
      ipAddress: input.ipAddress == null ? undefined : String(input.ipAddress),
      userAgent: input.userAgent == null ? undefined : String(input.userAgent),
      properties: this.normalizeProperties(input.properties),
    } as unknown as Prisma.EventCreateInput;

    return this.prisma.event.create({
      data,
    });
  }

  findAll(filter?: EventFilterInput) {
    return this.prisma.event.findMany({
      where: this.buildWhere(filter),
      orderBy: { createdAt: 'desc' },
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
    const data: Record<string, unknown> = {};

    if (input.host != null) {
      data.host = input.host;
    }

    if (input.eventName != null) {
      data.eventName = input.eventName;
    }

    if (input.url != null) {
      data.url = input.url;
    }

    if (input.properties != null) {
      data.properties = this.normalizeProperties(input.properties);
    }

    if (typeof input.userUuid === 'string') {
      data.userUuid = input.userUuid;
    }

    if (input.location != null) {
      data.location = input.location;
    }

    if (input.ipAddress != null) {
      data.ipAddress = input.ipAddress;
    }

    if (input.userAgent != null) {
      data.userAgent = input.userAgent;
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

    const where: Record<string, unknown> = {};

    if (filter.host) {
      where.host = filter.host;
    }

    if (filter.eventName) {
      where.eventName = filter.eventName;
    }

    if (typeof filter.userUuid === 'string') {
      where.userUuid = filter.userUuid;
    }

    if (typeof filter.location === 'string') {
      where.location = filter.location;
    }

    if (typeof filter.ipAddress === 'string') {
      where.ipAddress = filter.ipAddress;
    }

    if (typeof filter.userAgent === 'string') {
      where.userAgent = filter.userAgent;
    }

    return where as Prisma.EventWhereInput;
  }

  private normalizeProperties(value?: string | null): string {
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
}
