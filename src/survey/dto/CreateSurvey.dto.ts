import { AgeGroup } from '@constants/ageGroup';
import { Currency } from '@constants/currency';
import { ExperienceGroup } from '@constants/experienceGroup';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

export class CreateSurveytDto {
  @ApiProperty({ enum: AgeGroup })
  @IsEnum(AgeGroup)
  ageGroup: AgeGroup;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  industry: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  salary: number;

  @ApiProperty({ enum: Currency })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ type: String, required: false })
  city?: string;

  @ApiProperty({ type: String, required: false })
  state?: string;

  @ApiProperty({ type: String, required: false })
  country?: string;

  @ApiProperty({ enum: ExperienceGroup })
  @IsEnum(ExperienceGroup)
  experience: ExperienceGroup;

  @ApiProperty({ type: String, required: false })
  additional?: string;

  @ApiProperty({ type: String, required: false })
  other?: string;
}
