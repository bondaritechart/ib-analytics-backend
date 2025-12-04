import {
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateEventInput {
  @IsString()
  host: string;

  @IsString()
  eventName: string;

  @IsUrl()
  url: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  properties?: string;
}

