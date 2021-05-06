import { Roll, RollInputType } from "../entities/Roll";
import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { Participant } from "../entities/Participant";
// import { MyContext } from "../types";

@Resolver()
export class RollResolver {
  @Query(() => [Roll]) // graph ql type
  rolls(): Promise<Roll[]> {
    return Roll.find();
  }

  @Query(() => Roll, { nullable: true })
  roll(@Arg("id") id: number): Promise<Roll | undefined> {
    return Roll.findOne(id);
  }

  @Mutation(() => Roll)
  async createRoll(@Arg("rollData") roll: RollInputType): Promise<Roll> {
    const participants = await Promise.all(
      roll.participants.map(async (p) => {
        console.log(p);
        return Participant.create(p).save();
      })
    );

    // const newParticipant = await Participant.create(roll.participants).save();
    const newRoll = new Roll();
    newRoll.name = roll.name;
    newRoll.participants = participants;
    await newRoll.save();
    // await Roll.create(roll).save();
    return newRoll;
  }

  // @Ctx() {}: MyContext to bind with our context

  @Mutation(() => Roll, { nullable: true })
  async updateRoll(
    @Arg("id") id: number,
    @Arg("name", () => String, { nullable: true }) name: string
  ): Promise<Roll | undefined> {
    const roll = await Roll.findOne(id);
    if (!roll) {
      return undefined;
    }
    if (typeof name !== "undefined") {
      roll.name = name;
      await Roll.update({ id }, { name });
    }
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
