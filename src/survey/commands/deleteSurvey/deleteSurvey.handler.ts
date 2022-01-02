import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  SurveyRepository,
  SurveyRepositorySymbol,
} from '@survey/survey.repository';
import { DeleteSurveyCommand } from './deleteSurvey.command';

@CommandHandler(DeleteSurveyCommand)
export class DeleteSurveyHandler
  implements ICommandHandler<DeleteSurveyCommand>
{
  constructor(
    @Inject(SurveyRepositorySymbol)
    private readonly repository: SurveyRepository,
  ) {}

  async execute(command: DeleteSurveyCommand): Promise<void> {
    const { id } = command;

    this.repository.deleteByIds([id]);
    return;
  }
}
