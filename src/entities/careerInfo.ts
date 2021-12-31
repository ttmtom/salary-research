import { Curreny } from '@constants/curreny';
import { ExperienceGroup } from '@constants/experienceGroup';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Industry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;
}

@Entity()
export class Title {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;
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
}

@Entity()
export class CareerInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Industry)
  industry: Industry;

  @ManyToOne(() => Title)
  title: Title;

  @Column({
    type: 'enum',
    enum: ExperienceGroup,
  })
  experienceGroup: ExperienceGroup;

  @Column('text')
  additional: string;
}
