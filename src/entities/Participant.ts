import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
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
  isActive: boolean;

  @Field()
  @Column()
  rollId: number;

  @Field((type) => Roll)
  @ManyToOne(() => Roll, (roll) => roll.participants, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  roll: Roll;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

@InputType()
export class ParticipantInputType {
  @Field()
  name!: string;

  @Field()
  phoneNumber!: string;
}
