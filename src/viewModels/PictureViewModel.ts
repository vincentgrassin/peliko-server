import { Entity } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { ParticipantViewModel } from "./ParticipantViewModel";
import { RollViewModel } from "./RollViewModel";

@ObjectType()
@Entity()
export class PictureViewModel {
  @Field()
  id: number;

  @Field()
  cloudinaryPublicId!: string;

  @Field()
  height: number;

  @Field()
  width: number;

  @Field(() => ParticipantViewModel)
  participant: ParticipantViewModel;

  @Field(() => RollViewModel)
  roll: RollViewModel;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
