import { ApiProperty } from '@nestjs/swagger';

export class DeleteRes {
  @ApiProperty({
    type: Boolean,
  })
  success: boolean;
}
