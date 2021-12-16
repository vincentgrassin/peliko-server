import { Field, ObjectType } from "type-graphql";
import { PictureViewModel } from "./PictureViewModel";
import { ParticipantViewModel } from "./ParticipantViewModel";

@ObjectType()
export class RollViewModel {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  deliveryType?: string;

  @Field()
  closingDate: Date;

  @Field()
  pictureNumber: number;

  @Field()
  remainingPictures: number;

  @Field()
  isOpen: boolean;

  @Field({ nullable: true })
  accessCode: string;

  @Field({ nullable: true })
  coverPictureId?: string;

  @Field(() => [ParticipantViewModel])
  participants: ParticipantViewModel[];

  @Field(() => [PictureViewModel])
  pictures: PictureViewModel[];

  @Field()
  creationDate: Date;

  @Field()
  updateDate: Date;
}
