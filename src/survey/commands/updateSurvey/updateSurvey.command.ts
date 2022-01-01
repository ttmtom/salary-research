import { Survey } from '@db/entities';
import { UpdateSurveytDto } from '@survey/dto/UpdateSurvey.dto';

export class UpdateSurveyCommand {
  constructor(
    public readonly data: UpdateSurveytDto,
    public readonly survey: Survey,
  ) {}
}
