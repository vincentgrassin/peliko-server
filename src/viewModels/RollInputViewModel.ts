import { Field, InputType } from "type-graphql";
import { ParticipantInputViewModel } from "./ParticipantInputViewModel";

@InputType()
export class RollInputViewModel {
  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  deliveryType?: string;

  @Field({ nullable: true })
  closingDate: Date;

  @Field(() => [ParticipantInputViewModel], { nullable: true })
  participants: ParticipantInputViewModel[];
}
