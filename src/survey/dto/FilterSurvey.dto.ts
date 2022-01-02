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
    required: false,
  })
  @IsOptional()
  @IsEnum(AgeGroup, { each: true })
  ageGroup: AgeGroup[] | AgeGroup;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsNotEmpty()
  industry: string;

  @ApiProperty({ enum: Currency, isArray: true, required: false })
  @IsOptional()
  @IsEnum(Currency, { each: true })
  currency: Currency[] | Currency;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'ExperienceGroup range, [from, to] or [targetGroup]',
    isArray: true,
    enum: ExperienceGroup,
    required: false,
  })
  @IsOptional()
  @IsEnum(ExperienceGroup, { each: true })
  experience: ExperienceGroup[] | ExperienceGroup;
}
