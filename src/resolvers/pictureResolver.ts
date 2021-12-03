import { Participant } from "../entities/Participant";
import {
  Resolver,
  Arg,
  Mutation,
  UseMiddleware,
  Ctx,
  Query,
} from "type-graphql";
import { createQueryBuilder } from "typeorm";
import { Picture } from "../entities/Picture";
import { Roll } from "../entities/Roll";
import { errorMessages } from "../constants";
import { isAuth } from "../isAuth";
import { MyContext } from "../MyContext";
import { PaginatedPicturesByRoll } from "../entities/objectType";

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
      throw new Error(errorMessages.unabledToFind);
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

  @Query(() => [Picture])
  @UseMiddleware(isAuth)
  async getPicturesByRoll(
    @Arg("rollId") rollId: number,
    @Ctx() { payload }: MyContext
  ): Promise<(Picture | undefined)[]> {
    if (!payload) {
      throw new Error(errorMessages.unabledToFind);
    }
    const pictures = await createQueryBuilder("picture")
      .select("picture")
      .from(Picture, "picture")
      .where("picture.rollId = :rollId", { rollId })
      .getMany();

    return pictures;
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
      throw new Error(errorMessages.unabledToFind);
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
