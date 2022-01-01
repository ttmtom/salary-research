import { Survey } from '@db/entities';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  SurveyRepository,
  SurveyRepositorySymbol,
} from '@survey/survey.repository';
import { UpdateSurveyCommand } from './updateSurvey.command';

@CommandHandler(UpdateSurveyCommand)
export class UpdateSurveyHandler
  implements ICommandHandler<UpdateSurveyCommand, Survey>
{
  constructor(
    @Inject(SurveyRepositorySymbol)
    private readonly repository: SurveyRepository,
  ) {}

  async execute(command: UpdateSurveyCommand): Promise<Survey> {
    const { survey, data } = command;

    const updated = await this.repository.updateForm(data, survey);

    return updated;
  }
}
