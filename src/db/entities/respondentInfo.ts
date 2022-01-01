import { AgeGroup } from '@constants/ageGroup';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Address } from '.';

@Entity()
export class RespondentInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: AgeGroup,
  })
  ageGroup: AgeGroup;

  @OneToOne(() => Address, { eager: true })
  @JoinColumn()
  address: Address;

  constructor(ageGroup: AgeGroup, address: Address) {
    this.ageGroup = ageGroup;
    this.address = address;
  }
}
