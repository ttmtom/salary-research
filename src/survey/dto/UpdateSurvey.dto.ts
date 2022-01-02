import { AgeGroup } from '@constants/ageGroup';
import { Currency } from '@constants/currency';
import { ExperienceGroup } from '@constants/experienceGroup';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsEnum, IsOptional, IsPositive } from 'class-validator';

export class UpdateSurveytDto {
  @ApiProperty({ enum: AgeGroup, required: false })
  @IsOptional()
  @IsEnum(AgeGroup)
  ageGroup?: AgeGroup;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  industry?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  title?: string;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsPositive()
  @IsNumber()
  salary?: number;

  @ApiProperty({ enum: Currency, required: false })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  city?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  state?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  country?: string;

  @ApiProperty({ enum: ExperienceGroup, required: false })
  @IsOptional()
  @IsEnum(ExperienceGroup)
  experience?: ExperienceGroup;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  additional?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  other?: string;
}
