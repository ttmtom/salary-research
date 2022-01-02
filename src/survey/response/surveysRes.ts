import { Survey } from '@db/entities/survey';
import { ApiProperty } from '@nestjs/swagger';

export class SurveysRes {
  @ApiProperty({
    type: [Survey],
  })
  data: Survey[];
}
