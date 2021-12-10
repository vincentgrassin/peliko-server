import { Roll } from "../entities/Roll";
import { createQueryBuilder } from "typeorm";
import { User } from "../entities/User";

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

export const findUserByPhoneNumber = async (phoneNumber: string) => {
  return await createQueryBuilder("user")
    .select("user")
    .from(User, "user")
    .where("user.phoneNumber = :phoneNumber", {
      phoneNumber,
    })
    .getOne();
};

export const findUserById = async (userId: number) => {
  return await createQueryBuilder("user")
    .select("user")
    .from(User, "user")
    .where("user.id = :userId", { userId })
    .getOne();
};
