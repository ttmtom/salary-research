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

  @Column('timestamp')
  timestamp: Date;

  @OneToOne(() => RespondentInfo)
  @JoinColumn()
  respondentInfo: RespondentInfo;

  @OneToOne(() => CareerInfo)
  @JoinColumn()
  careerInfo: CareerInfo;

  @Column('text')
  other: string;
}
