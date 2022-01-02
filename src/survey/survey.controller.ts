import { Currency } from '@constants/currency';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseEnumPipe,
  Post,
  Put,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { DeleteSurveyCommand } from './commands/deleteSurvey/deleteSurvey.command';
import { InsertSurveyCommand } from './commands/insertSurvey/insertSurvey.command';
import { UpdateSurveyCommand } from './commands/updateSurvey/updateSurvey.command';
import { CreateSurveytDto } from './dto/CreateSurvey.dto';
import { UpdateSurveytDto } from './dto/UpdateSurvey.dto';
import { GetSalaryAveragerQuery } from './queries/getSalaryAverager/getSalaryAverager.query';
import { GetSurveyQuery } from './queries/getSurvey/getSurvey.query';
import { AverageSalaryRes } from './response/averageSalary';
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
    @Body() createSurveytDto: CreateSurveytDto,
  ): Promise<SurveyRes> {
    const survey = await this.commandBus.execute(
      new InsertSurveyCommand(createSurveytDto),
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
    const survey = await this.queryBus.execute(new GetSurveyQuery(id));

    if (!survey) {
      throw new HttpException('Survey not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      data: survey,
    };
  }

  @Post('/:id')
  async updateSurvey(
    @Body() updateSurveytDto: UpdateSurveytDto,
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ): Promise<SurveyRes> {
    if (Object.keys(updateSurveytDto).length === 0) {
      throw new HttpException('Update Object is empty', HttpStatus.BAD_REQUEST);
    }

    let survey = await this.queryBus.execute(new GetSurveyQuery(id));
    if (!survey) {
      throw new HttpException('Survey not found', HttpStatus.NOT_FOUND);
    }

    survey = await this.commandBus.execute(
      new UpdateSurveyCommand(updateSurveytDto, survey),
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
    const survey = await this.queryBus.execute(new GetSurveyQuery(id));
    if (!survey) {
      throw new HttpException('Survey not found', HttpStatus.NOT_FOUND);
    }

    await this.commandBus.execute(new DeleteSurveyCommand(id));

    return { success: true };
  }

  @Get('/salary/averager')
  @ApiQuery({ name: 'currency', enum: Currency, required: false })
  @ApiQuery({ name: 'title', type: String })
  async getAveragerSalary(
    @Query('title')
    title: string,
    @Query(
      'currency',
      new DefaultValuePipe(Currency.HKD),
      new ParseEnumPipe(Currency, {
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    currency: Currency = Currency.HKD,
  ): Promise<AverageSalaryRes> {
    const average = await this.queryBus.execute(
      new GetSalaryAveragerQuery(currency, title),
    );
    return {
      currency,
      average,
    };
  }
}
