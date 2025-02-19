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
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { DeleteSurveyCommand } from './commands/deleteSurvey/deleteSurvey.command';
import { InsertSurveyCommand } from './commands/insertSurvey/insertSurvey.command';
import { UpdateSurveyCommand } from './commands/updateSurvey/updateSurvey.command';
import { CreateSurveytDto } from './dto/CreateSurvey.dto';
import { FilterSurveytDto } from './dto/FilterSurvey.dto';
import { UpdateSurveytDto } from './dto/UpdateSurvey.dto';
import { GetFilterSurveyQuery } from './queries/getFilterSurvey/getFilterSurvey.query';
import { GetSalaryAveragerQuery } from './queries/getSalaryAverager/getSalaryAverager.query';
import { GetSurveyQuery } from './queries/getSurvey/getSurvey.query';
import { AverageSalaryRes } from './response/averageSalary';
import { DeleteRes } from './response/deleteRes';
import { FilteredSurveyRes } from './response/filteredSurveyRes';
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
  @ApiOperation({ summary: 'Get all survey default row 0 to row 200' })
  @ApiQuery({ name: 'from', type: Number, required: false })
  @ApiQuery({ name: 'to', type: Number, required: false })
  async getAllSurvey(
    @Query(
      'from',
      new DefaultValuePipe(0),
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    from: number,
    @Query(
      'to',
      new DefaultValuePipe(200),
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    to: number,
  ): Promise<SurveysRes> {
    if (from < 0 || to < 0) {
      throw new HttpException(
        'from and to params should a positive number',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (from > to) {
      throw new HttpException('not a vaild range', HttpStatus.NOT_ACCEPTABLE);
    }

    const data = await this.queryBus.execute(
      new GetSurveyQuery(null, null, from, to),
    );

    return { data };
  }

  @Put('/')
  @ApiOperation({ summary: 'Insert a new survey' })
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
  @ApiOperation({ summary: 'Get survey by id' })
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
  @ApiOperation({ summary: 'update survey by id' })
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
  @ApiOperation({ summary: 'Delete survey by id' })
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
  @ApiOperation({
    summary:
      'Get averager salary by title keyword, default currency is HKD. Other currency has same rate with HKD',
  })
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

    if (!average) {
      throw new HttpException('No related title', HttpStatus.NOT_FOUND);
    }

    return {
      currency,
      average,
    };
  }

  @Get('/data/filter')
  @ApiOperation({ summary: 'Post a filter object and return the match survey' })
  async getFilteredData(
    @Query() filterSurveytDto: FilterSurveytDto,
  ): Promise<FilteredSurveyRes> {
    if (Object.keys(filterSurveytDto).length === 0) {
      throw new HttpException(
        'Empty object not allowed',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (
      (filterSurveytDto.ageGroup && !filterSurveytDto.ageGroup.length) ||
      (filterSurveytDto.experience && !filterSurveytDto.experience.length)
    ) {
      throw new HttpException(
        'Empty array not allowed',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const surveys = await this.queryBus.execute(
      new GetFilterSurveyQuery(filterSurveytDto),
    );

    return {
      success: true,
      data: surveys,
    };
  }
}
