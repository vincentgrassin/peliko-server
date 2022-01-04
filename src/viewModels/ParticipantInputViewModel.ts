import { Field, InputType } from "type-graphql";

@InputType()
export class ParticipantInputViewModel {
  @Field()
  phoneNumber!: string;

  @Field({ nullable: true })
  name?: string;

  isActive?: boolean;

  isRollAdmin?: boolean;
}
