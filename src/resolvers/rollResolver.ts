import { Roll, RollInputType } from "../entities/Roll";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { Participant } from "../entities/Participant";
import { createQueryBuilder } from "typeorm";
import { User } from "../entities/User";
import { errorMessages } from "../constants";
import { MyContext } from "../MyContext";
import { isAuth } from "../isAuth";
import {
  getActiveInvitationRollsByUser,
  getRollWithAllParticipants,
} from "./queriesHelpers";
import { RollViewModel } from "../viewModels/RollViewModel";
import { Picture } from "../entities/Picture";
import { InvitationRollViewModel } from "../viewModels/InvitationRollViewModel";

// TO DO
// utiliser les viewmodels dans toutes les query (attention au field nullable dans @Field ?)
// createRoll /!\ le front doit faire un check d'emptiness sur les numero de tel

@Resolver()
export class RollResolver {
  @Query(() => [Roll]) // graph ql type
  rolls(): Promise<Roll[]> {
    return Roll.find();
  }

  @Query(() => [RollViewModel])
  @UseMiddleware(isAuth)
  async rollsByUser(
    @Arg("isOpenTab") isOpenTab: boolean,
    @Ctx() { payload }: MyContext
  ): Promise<(RollViewModel | undefined)[]> {
    if (!payload) {
      throw new Error(errorMessages.unauthorized);
    }
    const { userId: id } = payload;
    const isRollClosingDateExpired = isOpenTab
      ? "roll.closingDate > :date"
      : "roll.closingDate <= :date";

    const rollIds = await createQueryBuilder("roll")
      .select(["roll"])
      .from(Roll, "roll")
      .leftJoinAndSelect("roll.participants", "participant")
      .where("participant.userId = :id", { id })
      .andWhere("participant.isActive = true")
      .andWhere(isRollClosingDateExpired, {
        date: new Date(),
      })
      .select(["roll.id"])
      .getMany();

    const rollViewModels = await Promise.all(
      rollIds.map(async (id) => {
        if (id) {
          const roll = await getRollWithAllParticipants(id);
          const coverPicture = await Picture.findOne({
            where: { rollId: id },
          });
          if (roll) {
            const rollViewModel: RollViewModel = roll;

            rollViewModel.coverPictureId =
              coverPicture && coverPicture.cloudinaryPublicId;
            return rollViewModel;
          }
        }
        return undefined;
      })
    );

    if (!rollViewModels) {
      throw new Error(errorMessages.unabledToFind);
    }
    return rollViewModels;
  }

  @Query(() => Roll, { nullable: true })
  async roll(@Arg("id") id: number): Promise<Roll | undefined> {
    const roll = await createQueryBuilder("roll")
      .select("roll")
      .from(Roll, "roll")
      .leftJoinAndSelect("roll.participants", "participant")
      .where("roll.id = :id", { id })
      .getOne();

    if (!roll) {
      throw new Error(errorMessages.unabledToFind);
    }
    return roll;
  }

  @Mutation(() => Roll)
  @UseMiddleware(isAuth)
  async createRoll(
    @Arg("rollData") roll: RollInputType,
    @Ctx() { payload }: MyContext
  ): Promise<Roll> {
    if (!payload) {
      throw new Error(errorMessages.unauthorized);
    }
    const { userId } = payload;
    const userAdmin = await User.findOne(userId);
    if (!userAdmin) {
      throw new Error(errorMessages.unrecognizedUser);
    }

    roll.participants = [
      ...roll.participants,
      {
        phoneNumber: userAdmin?.phoneNumber,
        isActive: true,
        isRollAdmin: true,
      },
    ];

    const participants = await Promise.all(
      roll.participants.map(async (p) => {
        const user = await createQueryBuilder("user")
          .select("user")
          .from(User, "user")
          .where("user.phoneNumber = :phoneNumber", {
            phoneNumber: p.phoneNumber,
          })
          .getOne();

        return Participant.create({ ...p, userId: user?.id });
      })
    );

    const newRoll = await Roll.create({
      ...roll,
      participants: participants,
    }).save();
    return newRoll;
  }

  @Mutation(() => Roll, { nullable: true })
  async updateRoll(
    @Arg("id") id: number,
    @Arg("rollData") rollData: RollInputType
  ): Promise<Roll | undefined> {
    const roll = await Roll.findOne(id);
    if (!roll) {
      return undefined;
    }
    const participants = await Promise.all(
      rollData.participants.map(async (p) => Participant.create(p))
    );
    roll.participants = participants;
    await roll.save();

    return roll;
  }

  @Mutation(() => Boolean)
  async deleteRoll(@Arg("id") id: number): Promise<boolean> {
    try {
      await Roll.delete(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  @Query(() => [InvitationRollViewModel])
  @UseMiddleware(isAuth)
  async invitationRollsByUser(
    @Ctx() { payload }: MyContext
  ): Promise<InvitationRollViewModel[]> {
    if (!payload) {
      throw new Error(errorMessages.unauthorized);
    }
    const { userId } = payload;
    const rolls = await (
      await getActiveInvitationRollsByUser(userId)
    ).getMany();
    const invitationRolls: InvitationRollViewModel[] = await Promise.all(
      rolls.map(async (roll) => {
        const participantAdmin = roll.participants.find((p) => p.isRollAdmin);
        const userAdmin = await User.findOne(participantAdmin?.userId);
        return {
          roll: roll,
          admin: userAdmin,
        };
      })
    );

    return invitationRolls;
  }

  @Query(() => Number)
  @UseMiddleware(isAuth)
  async invitationNotificationCountByUser(
    @Ctx() { payload }: MyContext
  ): Promise<Number> {
    if (!payload) {
      throw new Error(errorMessages.unauthorized);
    }
    const { userId } = payload;
    const count = (await getActiveInvitationRollsByUser(userId)).getCount();

    return count;
  }
}
