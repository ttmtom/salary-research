import { Survey } from '@db/entities/survey';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  SurveyRepository,
  SurveyRepositorySymbol,
} from '@survey/survey.repository';
import { GetFilterSurveyQuery } from './getFilterSurvey.query';

@QueryHandler(GetFilterSurveyQuery)
export class GetFilterSurveyHandler
  implements IQueryHandler<GetFilterSurveyQuery, Survey[]>
{
  constructor(
    @Inject(SurveyRepositorySymbol)
    private readonly repository: SurveyRepository,
  ) {}

  async execute(query: GetFilterSurveyQuery): Promise<Survey[]> {
    const surveys = await this.repository.selectFilterSurvey(
      query.filterSurveytDto,
    );
    return surveys;
  }
}
