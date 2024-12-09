import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class VectorData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column('text')
  content: string;

  @Column('float', { array: true })
  vector: number[];

  @CreateDateColumn()
  createdAt: Date;
}
