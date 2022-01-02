import { Survey } from '@db/entities/survey';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions } from 'typeorm';
import { connectionName } from '@db/connection';
import { Repository, Like, In } from 'typeorm';
import {
  Address,
  CareerInfo,
  City,
  Country,
  Industry,
  RespondentInfo,
  Salary,
  State,
  Title,
} from '@db/entities';
import { CreateSurveytDto } from './dto/CreateSurvey.dto';
import { UpdateSurveytDto } from './dto/UpdateSurvey.dto';
import { Currency } from '@constants/currency';
import { FilterSurveytDto } from './dto/FilterSurvey.dto';

export interface ISurveyRepository {
  save(survey: Survey): Promise<Survey>;
  saveForm(data: CreateSurveytDto): Promise<Survey>;
  deleteByIds(ids: string[]): void;
  findAll(from: number, to: number): Promise<Survey[]>;
  findBySurveyId(id: string): Promise<Survey>;
  findBySurveyIds(ids: string[]): Promise<Survey[]>;
}

export const SurveyRepositorySymbol = Symbol('survey_repository');

@Injectable()
export class SurveyRepository implements ISurveyRepository {
  constructor(
    @InjectRepository(Survey, connectionName)
    private readonly surveyRepository: Repository<Survey>,
    @InjectRepository(Industry, connectionName)
    private readonly industryRepository: Repository<Industry>,
    @InjectRepository(Title, connectionName)
    private readonly titleRepository: Repository<Title>,
    @InjectRepository(City, connectionName)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(State, connectionName)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(Country, connectionName)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Address, connectionName)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(RespondentInfo, connectionName)
    private readonly respondentInfoRepository: Repository<RespondentInfo>,
    @InjectRepository(Salary, connectionName)
    private readonly salaryRepository: Repository<Salary>,
    @InjectRepository(CareerInfo, connectionName)
    private readonly careerInfoRepository: Repository<CareerInfo>,
  ) {}

  async getOrCreateIndustry(name: string): Promise<Industry> {
    return this.industryRepository
      .findOneOrFail({ where: [{ name }] })
      .then((data) => data)
      .catch(() => this.industryRepository.save(new Industry(name)));
  }

  async getOrCreateTitle(name: string): Promise<Title> {
    return this.titleRepository
      .findOneOrFail({ where: [{ name }] })
      .then((data) => data)
      .catch(() => this.titleRepository.save(new Title(name)));
  }

  async getOrCreateCity(name: string): Promise<City> {
    return this.cityRepository
      .findOneOrFail({ where: [{ name }] })
      .then((data) => data)
      .catch(() => this.cityRepository.save(new City(name)));
  }

  async getOrCreateState(name: string): Promise<State> {
    return this.stateRepository
      .findOneOrFail({ where: [{ name }] })
      .then((data) => data)
      .catch(() => this.stateRepository.save(new State(name)));
  }

  async getOrCreateCountry(name: string): Promise<Country> {
    return this.stateRepository
      .findOneOrFail({ where: [{ name }] })
      .then((data) => data)
      .catch(() => this.countryRepository.save(new Country(name)));
  }

  async saveForm(data: CreateSurveytDto): Promise<Survey> {
    const {
      industry,
      city,
      state,
      country,
      ageGroup,
      title,
      salary,
      currency,
      experience,
      additional,
      other,
    } = data;

    const dbCountry: Country | null = country
      ? await this.getOrCreateCountry(country)
      : null;
    const dbState: State | null = state
      ? await this.getOrCreateState(state)
      : null;
    const dbCity: City | null = city ? await this.getOrCreateCity(city) : null;
    const dbAddress: Address = await this.addressRepository.save(
      new Address(dbCity, dbState, dbCountry),
    );
    const dbRespondentInfo: RespondentInfo =
      await this.respondentInfoRepository.save(
        new RespondentInfo(ageGroup, dbAddress),
      );

    const dbIndustry: Industry = await this.getOrCreateIndustry(industry);
    const dbTitle: Title = await this.getOrCreateTitle(title);
    const dbSalary: Salary = await this.salaryRepository.save(
      new Salary(salary, currency),
    );
    const dbCareerInfo: CareerInfo = await this.careerInfoRepository.save(
      new CareerInfo(
        dbIndustry,
        dbTitle,
        dbSalary,
        experience,
        additional ?? '',
      ),
    );
    const dbSurvey = new Survey(dbRespondentInfo, dbCareerInfo, other ?? '');

    return this.surveyRepository.save(dbSurvey);
  }

  async updateForm(data: UpdateSurveytDto, survey: Survey): Promise<Survey> {
    let addressUpdated = false;
    let respondentInfoUpdated = false;
    let careerInfoUpdated = false;

    if (data.city && data.city !== survey.respondentInfo.address?.city.name) {
      const dbCity = await this.getOrCreateCity(data.city);
      survey.respondentInfo.address.city = dbCity;
      addressUpdated = true;
      respondentInfoUpdated = true;
    }

    if (
      data.state &&
      data.state !== survey.respondentInfo.address?.state.name
    ) {
      const dbState = await this.getOrCreateState(data.state);
      survey.respondentInfo.address.state = dbState;
      addressUpdated = true;
      respondentInfoUpdated = true;
    }

    if (
      data.country &&
      data.country !== survey.respondentInfo.address?.country.name
    ) {
      const dbCountry = await this.getOrCreateCountry(data.country);
      survey.respondentInfo.address.country = dbCountry;
      addressUpdated = true;
      respondentInfoUpdated = true;
    }

    if (data.ageGroup && data.ageGroup !== survey.respondentInfo.ageGroup) {
      survey.respondentInfo.ageGroup = data.ageGroup;
      respondentInfoUpdated = true;
    }

    if (data.industry && data.industry !== survey.careerInfo.industry.name) {
      const dbIndustry = await this.getOrCreateIndustry(data.industry);
      survey.careerInfo.industry = dbIndustry;
      careerInfoUpdated = true;
    }

    if (data.title && data.title !== survey.careerInfo.title.name) {
      const dbTitle = await this.getOrCreateTitle(data.title);
      survey.careerInfo.title = dbTitle;
      careerInfoUpdated = true;
    }

    if (
      data.experience &&
      data.experience !== survey.careerInfo.experienceGroup
    ) {
      survey.careerInfo.experienceGroup = data.experience;
      careerInfoUpdated = true;
    }

    if (data.additional && data.additional !== survey.careerInfo.additional) {
      survey.careerInfo.additional = data.additional;
      careerInfoUpdated = true;
    }

    if (data.other && data.other !== survey.other) {
      survey.other = data.other;
    }

    if (addressUpdated) {
      await this.addressRepository.save(survey.respondentInfo.address);
    }
    if (respondentInfoUpdated) {
      await this.respondentInfoRepository.save(survey.respondentInfo);
    }
    if (careerInfoUpdated) {
      await this.careerInfoRepository.save(survey.careerInfo);
    }

    const updated = await this.surveyRepository.save(survey);

    return updated;
  }

  async deleteByIds(ids: string[]): Promise<void> {
    await this.surveyRepository.delete(ids);
  }

  async findBySurveyId(id: string): Promise<Survey> {
    const surveys = await this.surveyRepository.findOne(id);
    return surveys;
  }

  async save(survey: Survey): Promise<Survey> {
    const resp = await this.surveyRepository.save(survey);
    return resp;
  }

  findAll(from = 0, to = 200): Promise<Survey[]> {
    return this.surveyRepository.find({
      skip: from,
      take: to - from,
    });
  }

  async findBySurveyIds(ids: string[]): Promise<Survey[]> {
    const surveys = await this.surveyRepository.findByIds(ids);
    return surveys;
  }

  async findSalaryByTitle(
    keyword: string,
  ): Promise<{ salary_amount: number; salary_currency: Currency }[]> {
    const data = await this.careerInfoRepository
      .createQueryBuilder('career')
      .leftJoinAndSelect('career.title', 'title')
      .leftJoinAndSelect('career.salary', 'salary')
      .where('title.name like :keyword', { keyword: `%${keyword}%` })
      .select(['salary.amount', 'salary.currency'])
      .execute();

    return data;
  }

  private getFilterWHereObj(
    filterSurveytDto: FilterSurveytDto,
  ): FindConditions<Survey> {
    const whereObj: FindConditions<Survey> = {};

    if (filterSurveytDto.industry) {
      whereObj.careerInfo = {
        ...whereObj.careerInfo,
        industry: {
          name: Like(`%${filterSurveytDto.industry}%`),
        },
      };
    }
    if (filterSurveytDto.title) {
      whereObj.careerInfo = {
        ...whereObj.careerInfo,
        title: {
          name: Like(`%${filterSurveytDto.title}%`),
        },
      };
    }
    if (filterSurveytDto.currency) {
      whereObj.careerInfo = {
        ...whereObj.careerInfo,
        salary: {
          currency: In(filterSurveytDto.currency),
        },
      };
    }

    if (filterSurveytDto.city) {
      whereObj.respondentInfo = {
        ...whereObj.respondentInfo,
        address: {
          city: {
            name: Like(`%${filterSurveytDto.city}%`),
          },
        },
      };
    }
    if (filterSurveytDto.state) {
      whereObj.respondentInfo = {
        ...whereObj.respondentInfo,
        address: {
          state: {
            name: Like(`%${filterSurveytDto.state}%`),
          },
        },
      };
    }
    if (filterSurveytDto.country) {
      whereObj.respondentInfo = {
        ...whereObj.respondentInfo,
        address: {
          country: {
            name: Like(`%${filterSurveytDto.country}%`),
          },
        },
      };
    }

    if (filterSurveytDto.ageGroup) {
      const { ageGroup } = filterSurveytDto;
      if (ageGroup.length === 1) {
        whereObj.respondentInfo = {
          ...whereObj.respondentInfo,
          ageGroup: In(ageGroup),
        };
      }
    }

    if (filterSurveytDto.experience) {
      const { experience } = filterSurveytDto;
      if (experience.length === 1) {
        whereObj.careerInfo = {
          ...whereObj.careerInfo,
          experienceGroup: In(experience),
        };
      }
    }

    return whereObj;
  }

  async selectFilterSurvey(
    filterSurveytDto: FilterSurveytDto,
  ): Promise<Survey[]> {
    const whereObj = this.getFilterWHereObj(filterSurveytDto);

    const data = await this.surveyRepository.find({
      relations: [
        'careerInfo',
        'careerInfo.title',
        'careerInfo.industry',
        'careerInfo.salary',
        'respondentInfo',
        'respondentInfo.address',
        'respondentInfo.address.city',
        'respondentInfo.address.state',
        'respondentInfo.address.country',
      ],
      where: whereObj,
    });

    return data;
  }
}
