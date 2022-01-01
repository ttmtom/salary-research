import { Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import DbObj from './dbObj';

@Entity()
export class State extends DbObj {
  @OneToMany(() => Address, (address) => address.state)
  addresses: Address[];
}

@Entity()
export class City extends DbObj {
  @OneToMany(() => Address, (address) => address.city)
  addresses: Address[];
}

@Entity()
export class Country extends DbObj {
  @OneToMany(() => Address, (address) => address.country)
  addresses: Address[];
}

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => City, {
    nullable: true,
    eager: true,
  })
  city?: City;

  @ManyToOne(() => State, {
    nullable: true,
    eager: true,
  })
  state?: State;

  @ManyToOne(() => Country, {
    nullable: true,
    eager: true,
  })
  country?: Country;

  constructor(city: City | null, state: State | null, country: Country | null) {
    this.city = city;
    this.state = state;
    this.country = country;
  }
}
