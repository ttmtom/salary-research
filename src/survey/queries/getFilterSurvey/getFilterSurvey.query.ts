import { FilterSurveytDto } from '@survey/dto/FilterSurvey.dto';

export class GetFilterSurveyQuery {
  constructor(public readonly filterSurveytDto: FilterSurveytDto) {}
}
