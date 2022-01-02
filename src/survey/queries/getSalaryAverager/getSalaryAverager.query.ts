import { Currency } from '@constants/currency';

export class GetSalaryAveragerQuery {
  constructor(
    public readonly currency: Currency,
    public readonly title: string,
  ) {}
}
