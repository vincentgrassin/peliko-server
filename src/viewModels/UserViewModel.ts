import { Entity } from "typeorm";
import { Field, ObjectType, Int } from "type-graphql";

@ObjectType()
@Entity()
export class UserViewModel {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  avatarCloudinaryPublicId?: string;

  @Field()
  phoneNumber: string;

  @Field(() => String)
  createdAt?: Date;

  @Field(() => String)
  updatedAt?: Date;
}
