import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Convert } from 'easy-currencies';
import * as Money from 'currency.js';
import {
  SurveyRepository,
  SurveyRepositorySymbol,
} from '@survey/survey.repository';
import { GetSalaryAveragerQuery } from './getSalaryAverager.query';
import { Currency } from '@constants/currency';

const getSupCurrency = (currency: Currency) => {
  if (currency === Currency.Other) {
    return Currency.HKD;
  }
  if (currency === Currency.AUDNZD) {
    return Currency.AUD;
  }
  return currency;
};

@QueryHandler(GetSalaryAveragerQuery)
export class GetSalaryAveragerHandler
  implements IQueryHandler<GetSalaryAveragerQuery, number>
{
  constructor(
    @Inject(SurveyRepositorySymbol)
    private readonly repository: SurveyRepository,
  ) {}

  async execute(query: GetSalaryAveragerQuery): Promise<number> {
    const salaryData = await this.repository.findSalaryByTitle(query.title);

    const baseCurrency = getSupCurrency(query.currency);

    const convert = await Convert().from(baseCurrency).fetch();
    const convertRates = convert.rates;

    const sum = salaryData.reduce((accum, salary) => {
      const targetCurrency = getSupCurrency(salary.salary_currency);
      const amount = Money(salary.salary_amount).divide(
        convertRates[targetCurrency],
      );
      return amount.add(accum);
    }, Money(0));

    return sum.divide(salaryData.length).value;
  }
}
