import { Participant } from "../entities/Participant";
import { Resolver, Arg, Mutation, UseMiddleware, Ctx } from "type-graphql";
import { createQueryBuilder } from "typeorm";
import { Picture } from "../entities/Picture";
import { Roll } from "../entities/Roll";
import { errorMessages } from "../constants";
import { isAuth } from "../isAuth";
import { MyContext } from "src/MyContext";

@Resolver()
export class PictureResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async uploadPicture(
    @Arg("cloudinaryId") cloudinaryId: string,
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
      roll.remainingPictures = roll?.remainingPictures - 1;
      await roll.save();
      await Picture.create({
        cloudinaryPublicId: cloudinaryId,
        participant: participant,
        roll: roll,
      }).save();
      return true;
    } else {
      throw new Error(errorMessages.pictureUploadFailed);
    }
  }
}
