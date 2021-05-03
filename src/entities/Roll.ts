import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType() // convert class to a type
@Entity()
export class Roll extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column() // add on object of config
  name!: string;

  @Field(() => String)
  @Column({
    unique: true,
    nullable: true,
  })
  description: string;

  @Field(() => String)
  @Column({
    unique: true,
    nullable: true,
  })
  deliveryType: string;

  @Field(() => Date)
  @Column({
    unique: true,
    nullable: true,
  })
  closingDate: Date;

  @Field(() => Date)
  @CreateDateColumn()
  creationDate: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updateDate: Date;

  @Field(() => Int)
  @Column({
    unique: true,
    nullable: true,
  })
  pictureNumber: number;

  @Field(() => Int)
  @Column({
    unique: true,
    nullable: true,
  })
  remainingPictures: number;

  @Field(() => Boolean)
  @Column({
    unique: true,
    nullable: true,
  })
  openingStatus: boolean;

  // accessCodeRoll: string | undefined;
  // participants: Participant[] | undefined;
  // pictures: Picture[] | undefined;
}
