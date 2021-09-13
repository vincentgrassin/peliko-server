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
