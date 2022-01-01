// import { Inject, Injectable } from '@nestjs/common';
// import { SurveysRes } from './response/surveysRes';
// import { SurveyRepository, SurveyRepositorySymbol } from './survey.repository';

// @Injectable()
// export class SurveyService {
//   constructor(
//     @Inject(SurveyRepositorySymbol)
//     private readonly repository: SurveyRepository,
//   ) {}

//   async getAllSurvey(): Promise<SurveysRes> {
//     const data = await this.repository.findAll();
//     return { data };
//   }

//   async deleteSurveyByIds(ids: string[]) {
//     await this.repository.deleteByIds(ids);
//   }
// }
