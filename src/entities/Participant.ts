import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Column,
} from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";
import { Roll } from "./Roll";

@ObjectType()
@Entity()
export class Participant extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @ManyToOne(() => Roll, (roll) => roll.participants)
  roll: Roll;
}

@InputType()
export class ParticipantInputType {
  @Field()
  name!: string;
}
