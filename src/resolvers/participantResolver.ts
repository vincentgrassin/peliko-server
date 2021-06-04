import { Roll } from "../entities/Roll";
import { Resolver, Arg, Mutation } from "type-graphql";
import { Participant } from "../entities/Participant";
import { createQueryBuilder } from "typeorm";
import { errorMessages } from "../constants";

@Resolver()
export class ParticipantResolver {
  @Mutation(() => Boolean)
  async joinRoll(
    @Arg("userId") userId: number,
    @Arg("rollId") rollId: number,
    @Arg("accessCode") accessCode: string
  ): Promise<boolean> {
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
  async declineRollInvitation(
    @Arg("userId") userId: number,
    @Arg("rollId") rollId: number
  ): Promise<boolean> {
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
