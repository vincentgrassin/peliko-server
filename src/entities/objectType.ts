import { Roll } from "../entities/Roll";
import { User } from "../entities/User";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class InvitationRollType {
  @Field(() => Roll)
  roll: Roll;
  @Field(() => User)
  admin: User | undefined;
}

@ObjectType()
export class LoginType {
  @Field()
  accessToken: string;
}
