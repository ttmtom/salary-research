import { Curreny } from '@constants/curreny';
import { ExperienceGroup } from '@constants/experienceGroup';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import DbObj from './dbObj';

@Entity()
export class Industry extends DbObj {
  @OneToMany(() => CareerInfo, (careerInfo) => careerInfo.industry)
  careerInfo: CareerInfo[];
}

@Entity()
export class Title extends DbObj {
  @OneToMany(() => CareerInfo, (careerInfo) => careerInfo.title)
  careerInfo: CareerInfo[];
}

@Entity()
export class Salary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: Curreny,
  })
  curreny: Curreny;

  constructor(salary: number, curreny: Curreny) {
    this.amount = salary;
    this.curreny = curreny;
  }
}

@Entity()
export class CareerInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Industry, { eager: true })
  industry: Industry;

  @ManyToOne(() => Title, { eager: true })
  title: Title;

  @OneToOne(() => Salary, { eager: true })
  @JoinColumn()
  salary: Salary;

  @Column({
    type: 'enum',
    enum: ExperienceGroup,
  })
  experienceGroup: ExperienceGroup;

  @Column('text')
  additional: string;

  constructor(
    industry: Industry,
    title: Title,
    salary: Salary,
    experienceGroup: ExperienceGroup,
    additional: string,
  ) {
    this.industry = industry;
    this.title = title;
    this.salary = salary;
    this.experienceGroup = experienceGroup;
    this.additional = additional;
  }
}
