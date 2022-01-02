import { CreateSurveytDto } from '@survey/dto/CreateSurvey.dto';

export class InsertSurveyCommand {
  constructor(public readonly data: CreateSurveytDto) {}
}
