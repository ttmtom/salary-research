import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;
}

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;
}

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;
}

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => City)
  city: City;

  @ManyToOne(() => State)
  state: State;

  @ManyToOne(() => Country)
  country: Country;
}
