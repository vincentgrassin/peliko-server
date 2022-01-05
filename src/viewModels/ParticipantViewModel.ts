import { Entity } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { RollViewModel } from "./RollViewModel";
import { UserViewModel } from "./UserViewModel";
import { PictureViewModel } from "./PictureViewModel";

@ObjectType()
@Entity()
export class ParticipantViewModel {
  @Field()
  id: number;

  @Field()
  phoneNumber: string;

  @Field()
  role?: string;

  @Field()
  isActive: boolean;

  @Field()
  isRollAdmin: boolean;

  @Field(() => RollViewModel)
  roll: RollViewModel;

  @Field({ nullable: true })
  userId: number;

  @Field(() => UserViewModel)
  user: UserViewModel;

  @Field(() => [PictureViewModel])
  pictures: PictureViewModel[];

  @Field()
  pictureCount: number;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
