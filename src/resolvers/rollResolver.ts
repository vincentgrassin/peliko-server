import { Roll, RollInputType } from "../entities/Roll";
import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { Participant } from "../entities/Participant";
import { createQueryBuilder, getConnection, getRepository } from "typeorm";
// import { MyContext } from "../types";
// @Ctx() {}: MyContext to bind with our context

@Resolver()
export class RollResolver {
  @Query(() => [Roll]) // graph ql type
  rolls(): Promise<Roll[]> {
    return Roll.find();
  }

  @Query(() => Roll, { nullable: true })
  async roll(@Arg("id") id: number): Promise<any | undefined> {
    const roll = await createQueryBuilder("roll")
      .select("roll")
      .from(Roll, "roll")
      .leftJoinAndSelect("roll.participants", "participant")
      .where("roll.id = :id", { id })
      .getOne();

    return roll;
  }

  @Mutation(() => Roll)
  async createRoll(@Arg("rollData") roll: RollInputType): Promise<Roll> {
    const participants = await Promise.all(
      roll.participants.map(async (p) => Participant.create(p))
    );
    console.log("CREATE PARTICIPANTS", participants);
    const newRoll = await Roll.create({
      ...roll,
      participants: participants,
    }).save();
    console.log("NEW ROLL", newRoll);
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
}
