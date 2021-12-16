import { Field, Int, ObjectType } from "type-graphql";
import { Picture } from "./Picture";

@ObjectType()
export class PaginatedPicturesByRoll {
  @Field(() => [Picture])
  pictures: Picture[];
  @Field(() => Int)
  count: number;
}
