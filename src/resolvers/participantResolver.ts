import { Roll } from "../entities/Roll";
import { Resolver, Arg, Mutation, Ctx, UseMiddleware } from "type-graphql";
import { Participant } from "../entities/Participant";
import { createQueryBuilder } from "typeorm";
import { errorMessages } from "../constants";
import { isAuth } from "../isAuth";
import { MyContext } from "../MyContext";

@Resolver()
export class ParticipantResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async joinRoll(
    @Arg("rollId") rollId: number,
    @Arg("accessCode") accessCode: string,
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

    if (!participant) throw new Error(errorMessages.unrecognizedParticipant);
    const roll = await Roll.findOne(rollId);

    if (accessCode !== roll?.accessCode)
      throw new Error(errorMessages.wrongRollAccessCode);
    participant.isActive = true;
    const participantUpdated = await participant.save();
    return !!participantUpdated;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async declineRollInvitation(
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

    if (!participant) throw new Error(errorMessages.unrecognizedParticipant);

    const participantDeleted = await Participant.delete(participant.id);

    return !!participantDeleted;
  }
}
