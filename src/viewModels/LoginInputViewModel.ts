import { Roll } from "../entities/Roll";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class LoginInputViewModel {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
