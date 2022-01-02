import { Column, PrimaryGeneratedColumn } from 'typeorm';

export default abstract class DbObj {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
