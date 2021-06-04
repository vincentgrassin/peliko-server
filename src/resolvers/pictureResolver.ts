import { Participant } from "../entities/Participant";
import { Resolver, Arg, Mutation } from "type-graphql";
import { createQueryBuilder } from "typeorm";
import { Picture } from "../entities/Picture";
import { Roll } from "../entities/Roll";
import { errorMessages } from "../constants";

@Resolver()
export class PictureResolver {
  @Mutation(() => Boolean)
  async uploadPicture(
    @Arg("cloudinaryId") cloudinaryId: string,
    @Arg("userId") userId: number,
    @Arg("rollId") rollId: number
  ): Promise<boolean> {
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
