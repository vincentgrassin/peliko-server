import { Roll } from "../entities/Roll";
import { User } from "../entities/User";
import { Field, ObjectType } from "type-graphql";
import { RollViewModel } from "./RollViewModel";
import { UserViewModel } from "./UserViewModel";

@ObjectType()
export class InvitationRollViewModel {
  @Field(() => RollViewModel)
  roll: RollViewModel;
  @Field(() => UserViewModel)
  admin: UserViewModel | undefined;
}
