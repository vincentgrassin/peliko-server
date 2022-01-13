import { Participant } from "../entities/Participant";
import { PaginatedPicturesByRoll } from "../entities/objectType";
import { Picture } from "../entities/Picture";
import { Roll } from "../entities/Roll";
import {
  Resolver,
  Arg,
  Mutation,
  UseMiddleware,
  Ctx,
  Query,
} from "type-graphql";
import { createQueryBuilder } from "typeorm";
import { errorMessages } from "../constants";
import { isAuth } from "../isAuth";
import { MyContext } from "../MyContext";
import { User } from "../entities/User";
import { PictureGalleryViewModel } from "../viewModels/PictureGalleryViewModel";

@Resolver()
export class PictureResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async uploadPicture(
    @Arg("cloudinaryId") cloudinaryId: string,
    @Arg("height") height: number,
    @Arg("width") width: number,
    @Arg("rollId") rollId: number,
    @Ctx() { payload }: MyContext
  ): Promise<boolean> {
    if (!payload) {
      throw new Error(errorMessages.unauthorized);
    }
    const { userId } = payload;
    const participant = await createQueryBuilder("participant")
      .select("participant")
      .from(Participant, "participant")
      .where("participant.userId = :userId", { userId })
      .andWhere("participant.rollId = :rollId", { rollId })
      .getOne();

    const roll = await Roll.findOne(rollId);

    if (participant && roll) {
      roll.remainingPictures--;
      await roll.save();
      participant.pictureCount++;
      await participant.save();
      await Picture.create({
        cloudinaryPublicId: cloudinaryId,
        participant: participant,
        height: height,
        width: width,
        roll: roll,
      }).save();
      return true;
    } else {
      throw new Error(errorMessages.pictureUploadFailed);
    }
  }

  @Query(() => [PictureGalleryViewModel])
  @UseMiddleware(isAuth)
  async getPicturesByRoll(
    @Arg("rollId") rollId: number,
    @Ctx() { payload }: MyContext
  ): Promise<(PictureGalleryViewModel | undefined)[]> {
    if (!payload) {
      throw new Error(errorMessages.unauthorized);
    }
    const pictures = await createQueryBuilder("picture")
      .select("picture")
      .from(Picture, "picture")
      .where("picture.rollId = :rollId", { rollId })
      .getMany();
    const picturesWithUserInfo = await Promise.all(
      pictures.map(async (picture) => {
        const participant = await createQueryBuilder("participant")
          .select("participant")
          .from(Participant, "participant")
          .leftJoinAndSelect("participant.user", "user")
          .where("participant.id = :id", { id: picture.participantId })
          .getOne();
        const user = await User.findOne(participant?.userId);
        if (user) {
          return {
            ...picture,
            user: {
              id: user.id,
              name: user.name,
              phoneNumber: user.phoneNumber,
            },
          };
        }
        return { ...picture, user: undefined };
      })
    );
    return picturesWithUserInfo;
  }

  @Query(() => PaginatedPicturesByRoll)
  @UseMiddleware(isAuth)
  async getPaginatedPicturesByRoll(
    @Arg("rollId") rollId: number,
    @Arg("limit") limit: number,
    @Arg("offset") offset: number,
    @Ctx() { payload }: MyContext
  ): Promise<{ count: number; pictures: Picture[] | undefined }> {
    if (!payload) {
      throw new Error(errorMessages.unauthorized);
    }
    const pictures = await createQueryBuilder("picture")
      .select("picture")
      .distinct(true)
      .from(Picture, "picture")
      .where("picture.rollId = :rollId", { rollId })
      .skip(offset)
      .take(limit)
      .getMany();

    return { pictures, count: pictures.length };
  }
}
