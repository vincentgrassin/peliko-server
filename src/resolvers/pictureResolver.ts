import { Participant } from "../entities/Participant";
import { Resolver, Arg, Mutation } from "type-graphql";
import { createQueryBuilder } from "typeorm";
import { Picture } from "../entities/Picture";
import { Roll } from "../entities/Roll";

@Resolver()
export class PictureResolver {
  @Mutation(() => Boolean)
  async uploadPicture(
    @Arg("cloudinaryId") cloudinaryId: string,
    @Arg("userId") userId: number,
    @Arg("rollId") rollId: number
  ): Promise<boolean> {
    console.log(userId, cloudinaryId, rollId);

    const participant = await createQueryBuilder("participant")
      .select("participant")
      .from(Participant, "participant")
      .where("participant.userId = :userId", { userId })
      .andWhere("participant.rollId = :rollId", { rollId })
      .getOne();

    const roll = await Roll.findOne(rollId);

    if (participant) {
      await Picture.create({
        cloudinaryPublicId: cloudinaryId,
        participant: participant,
        roll: roll,
      }).save();
      return true;
    } else {
      return false;
    }
  }
}
