import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  SurveyRepository,
  SurveyRepositorySymbol,
} from '@survey/survey.repository';
import { GetSalaryAveragerQuery } from './getSalaryAverager.query';

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

    console.log('---- get all salary');
    salaryData.forEach((row) => {
      console.log(row.salary_amount, row.salary_currency);
    });

    return 11;
  }
}
