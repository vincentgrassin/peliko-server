import { Roll } from "../entities/Roll";
import { User } from "../entities/User";
import { Field, Int, ObjectType } from "type-graphql";
import { Picture } from "./Picture";

@ObjectType()
export class PaginatedPicturesByRoll {
  @Field(() => [Picture])
  pictures: Picture[];
  @Field(() => Int)
  count: number;
}

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

  @Field()
  refreshToken: string;
}
