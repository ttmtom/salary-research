import { Survey } from '@db/entities/survey';
import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  SurveyRepository,
  SurveyRepositorySymbol,
} from '@survey/survey.repository';
import { GetSurveyQuery } from './getSurvey.query';

@QueryHandler(GetSurveyQuery)
export class GetSurveyHandler
  implements IQueryHandler<GetSurveyQuery, Survey[] | Survey>
{
  constructor(
    @Inject(SurveyRepositorySymbol)
    private readonly repository: SurveyRepository,
  ) {}

  async execute(query: GetSurveyQuery): Promise<Survey[] | Survey> {
    if (query.id) {
      return this.repository.findBySurveyId(query.id);
    } else if (query.ids) {
      return this.repository.findBySurveyIds(query.ids);
    } else {
      return this.repository.findAll(query.from, query.to);
    }
  }
}
