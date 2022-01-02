import { AgeGroup } from '@constants/ageGroup';
import { Currency } from '@constants/currency';
import { ExperienceGroup } from '@constants/experienceGroup';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class FilterSurveytDto {
  @ApiProperty({
    description: 'AgeGroup range, [from, to] or [targetGroup]',
    isArray: true,
    enum: AgeGroup,
  })
  @IsOptional()
  @IsEnum(AgeGroup, { each: true })
  ageGroup: AgeGroup[];

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  industry: string;

  @ApiProperty({ enum: Currency, isArray: true })
  @IsOptional()
  @IsEnum(Currency, { each: true })
  currency: Currency[];

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'ExperienceGroup range, [from, to] or [targetGroup]',
    isArray: true,
    enum: ExperienceGroup,
  })
  @IsOptional()
  @IsEnum(ExperienceGroup, { each: true })
  experience: ExperienceGroup[];
}
