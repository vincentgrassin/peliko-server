import { Entity } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { PictureViewModel } from "./PictureViewModel";
import { UserViewModel } from "./UserViewModel";

@ObjectType()
@Entity()
export class PictureGalleryViewModel extends PictureViewModel {
  @Field(() => UserViewModel)
  user: UserViewModel | undefined;
}
