import { Survey } from '@db/entities/survey';
import { ApiProperty } from '@nestjs/swagger';

export class FilteredSurveyRes {
  @ApiProperty({ type: Boolean })
  success: boolean;

  @ApiProperty({ type: [Survey] })
  data?: Survey[];
}
