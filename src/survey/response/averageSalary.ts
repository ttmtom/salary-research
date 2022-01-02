import { Currency } from '@constants/currency';
import { ApiProperty } from '@nestjs/swagger';

export class AverageSalaryRes {
  @ApiProperty({ enum: Currency })
  currency: Currency;

  @ApiProperty({ type: Number })
  average: number;
}
