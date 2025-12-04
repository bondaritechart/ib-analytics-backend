import { IsDateString, IsOptional, IsString } from 'class-validator';

export class EventFilterInput {
  @IsString()
  @IsOptional()
  host?: string;

  @IsString()
  @IsOptional()
  eventName?: string;

  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @IsDateString()
  @IsOptional()
  toDate?: string;
}

