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
  @CreateDateColumn()
  creationDate: Date;

  @Field()
  @UpdateDateColumn()
  updateDate: Date;

  @Field()
  @Column({
    nullable: true,
  })
  pictureNumber: number;

  @Field()
  @Column({
    nullable: true,
  })
  remainingPictures: number;

  @Field()
  @Column({
    nullable: true,
  })
  openingStatus: boolean;

  @OneToMany(() => Participant, (participant) => participant.roll)
  participants: Participant[];

  // accessCodeRoll: string | undefined;
  // participants: Participant[] | undefined;
  // pictures: Picture[] | undefined;
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
  date: Date;

  @Field(() => [ParticipantInputType], { nullable: true })
  participants: ParticipantInputType[];
}
