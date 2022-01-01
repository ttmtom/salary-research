import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { DeleteSurveyCommand } from './commands/deleteSurvey/deleteSurvey.command';
import { InsertSurveyCommand } from './commands/insertSurvey/insertSurvey.command';
import { UpdateSurveyCommand } from './commands/updateSurvey/updateSurvey.command';
import { CreateSurveytDto } from './dto/CreateSurvey.dto';
import { UpdateSurveytDto } from './dto/UpdateSurvey.dto';
import { GetSurveyQuery } from './queries/getSurvey/getSurvey.query';
import { DeleteRes } from './response/deleteRes';
import { SurveyRes } from './response/surveyRes';
import { SurveysRes } from './response/surveysRes';

@ApiTags('Survey')
@Controller('survey')
export class SurveyController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('/')
  async getAllSurvey(): Promise<SurveysRes> {
    const data = await this.queryBus.execute(new GetSurveyQuery());

    return {
      data,
    };
  }

  @Put('/')
  async insertSurvey(
    @Body() createWalletDto: CreateSurveytDto,
  ): Promise<SurveyRes> {
    const survey = await this.commandBus.execute(
      new InsertSurveyCommand(createWalletDto),
    );
    return {
      success: true,
      data: survey,
    };
  }

  @Get('/:id')
  async getSurvey(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ): Promise<SurveyRes> {
    const data = await this.queryBus.execute(new GetSurveyQuery(id));

    return {
      success: !!data,
      data,
    };
  }

  @Post('/:id')
  async updateSurvey(
    @Body() updateWalletDto: UpdateSurveytDto,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ): Promise<SurveyRes> {
    if (Object.keys(updateWalletDto).length === 0) {
      throw new HttpException('Update Object is empty', HttpStatus.BAD_REQUEST);
    }

    let survey = await this.queryBus.execute(new GetSurveyQuery(id));
    if (!survey) {
      throw new HttpException('Survey not found', HttpStatus.NOT_FOUND);
    }

    survey = await this.commandBus.execute(
      new UpdateSurveyCommand(updateWalletDto, survey),
    );

    return {
      success: true,
      data: survey,
    };
  }

  @Delete('/:id')
  async deleteSurvey(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ): Promise<DeleteRes> {
    await this.commandBus.execute(new DeleteSurveyCommand(id));

    return { success: true };
  }
}
