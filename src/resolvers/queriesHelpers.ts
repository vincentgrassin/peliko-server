import { Roll } from "../entities/Roll";
import { createQueryBuilder } from "typeorm";

export const getRollWithAllParticipants = async (r: Roll) => {
  return await createQueryBuilder("roll")
    .select("roll")
    .from(Roll, "roll")
    .leftJoinAndSelect("roll.participants", "participant")
    .where("roll.id = :id", { id: r.id })
    .getOne();
};

export const getActiveInvitationRollsByUser = async (userId: string) => {
  return createQueryBuilder("roll")
    .select("roll")
    .from(Roll, "roll")
    .leftJoinAndSelect("roll.participants", "participant")
    .where("participant.userId = :userId", { userId })
    .andWhere("participant.isActive = false")
    .andWhere("roll.closingDate > :date", {
      date: new Date(),
    });
};
