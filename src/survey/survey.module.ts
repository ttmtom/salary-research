import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyController } from './survey.controller';
import { SurveyRepository, SurveyRepositorySymbol } from './survey.repository';
import { connectionName } from '@db/connection';
import queries from './queries';
import commands from './commands';
import entities from '@db/entities';

@Module({
  imports: [TypeOrmModule.forFeature(entities, connectionName), CqrsModule],
  controllers: [SurveyController],
  providers: [
    {
      provide: SurveyRepositorySymbol,
      useClass: SurveyRepository,
    },
    ...queries,
    ...commands,
  ],
})
export class SurveyModule {}
