import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Column,
} from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";
import { Roll } from "./Roll";
import { defaultEntitiesValues } from "../constants";

@ObjectType()
@Entity()
export class Participant extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  phoneNumber!: string;

  @Field()
  @Column({
    nullable: true,
    default: defaultEntitiesValues.participantrole,
  })
  role?: string;

  @Field()
  @Column({
    default: false,
  })
  hasJoinedRoll: boolean;

  @ManyToOne(() => Roll, (roll) => roll.participants)
  roll: Roll;
}

@InputType()
export class ParticipantInputType {
  @Field()
  name!: string;

  @Field()
  phoneNumber!: string;
}
