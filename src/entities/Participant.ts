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
import { User } from "./User";
import { defaultEntitiesValues } from "../constants";

@ObjectType()
@Entity()
export class Participant extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

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

  @Field(() => Roll)
  @ManyToOne(() => Roll, (roll) => roll.participants, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  roll: Roll;

  @Field()
  @Column({
    nullable: true,
  })
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.participants, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
    nullable: true,
  })
  user: User;

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
  phoneNumber!: string;
}
