import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Participant } from "./Participant";
import { defaultEntitiesValues } from "../constants";
import { Picture } from "./Picture";

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

  @Field()
  @Column({
    nullable: true,
    default: defaultEntitiesValues.rollAccessCode,
  })
  accessCode: string;

  @Field(() => [Participant])
  @OneToMany(() => Participant, (participant) => participant.roll, {
    cascade: true,
  })
  participants: Participant[];

  @Field(() => [Picture])
  @OneToMany(() => Picture, (picture) => picture.roll, {
    cascade: true,
  })
  pictures: Picture[];

  @Field()
  @CreateDateColumn()
  creationDate: Date;

  @Field()
  @UpdateDateColumn()
  updateDate: Date;
}
