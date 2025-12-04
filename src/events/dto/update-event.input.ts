import {
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateEventInput {
  @IsString()
  @IsOptional()
  host?: string;

  @IsString()
  @IsOptional()
  eventName?: string;

  @IsUrl()
  @IsOptional()
  url?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  properties?: string;
}

