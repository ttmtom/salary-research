import { Survey } from '@db/entities';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  SurveyRepository,
  SurveyRepositorySymbol,
} from '@survey/survey.repository';
import { InsertSurveyCommand } from './insertSurvey.command';

@CommandHandler(InsertSurveyCommand)
export class InsertSurveyHandler
  implements ICommandHandler<InsertSurveyCommand, Survey>
{
  constructor(
    @Inject(SurveyRepositorySymbol)
    private readonly repository: SurveyRepository,
  ) {}

  async execute(command: InsertSurveyCommand): Promise<Survey> {
    const { data } = command;

    const survey = await this.repository.saveForm(data);
    return survey;
  }
}
