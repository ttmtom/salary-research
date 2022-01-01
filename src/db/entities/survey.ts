import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CareerInfo, RespondentInfo } from '.';

@Entity()
export class Survey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: string;

  @OneToOne(() => RespondentInfo, { eager: true })
  @JoinColumn()
  respondentInfo: RespondentInfo;

  @OneToOne(() => CareerInfo, { eager: true })
  @JoinColumn()
  careerInfo: CareerInfo;

  @Column('text')
  other: string;
  survey: any;

  constructor(
    respondentInfo: RespondentInfo,
    careerInfo: CareerInfo,
    other: string,
  ) {
    this.respondentInfo = respondentInfo;
    this.careerInfo = careerInfo;
    this.other = other;
  }
}
