import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";
import { Participant, ParticipantInputType } from "./Participant";
import { defaultEntitiesValues } from "../constants";

@ObjectType()
@Entity()
export class Roll extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column({
    nullable: true,
  })
  description: string;

  @Field()
  @Column({
    nullable: true,
  })
  deliveryType?: string;

  @Field()
  @Column({
    nullable: true,
  })
  closingDate: Date;

  @Field()
  @Column({
    nullable: true,
    default: defaultEntitiesValues.pictureNumber,
  })
  pictureNumber: number;

  @Field()
  @Column({
    nullable: true,
    default: defaultEntitiesValues.pictureNumber,
  })
  remainingPictures: number;

  @Field()
  @Column({
    default: true,
  })
  isOpen: boolean;

  @Field(() => [Participant])
  @OneToMany(() => Participant, (participant) => participant.roll, {
    cascade: true,
  })
  participants: Participant[];

  @Field()
  @CreateDateColumn()
  creationDate: Date;

  @Field()
  @UpdateDateColumn()
  updateDate: Date;
}

@InputType()
export class RollInputType {
  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  deliveryType?: string;

  @Field({ nullable: true })
  closingDate: Date;

  @Field(() => [ParticipantInputType], { nullable: true })
  participants: ParticipantInputType[];
}
