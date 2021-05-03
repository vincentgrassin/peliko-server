import { Roll } from "../entities/Roll";
import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";
import { MyContext } from "../types";

@Resolver()
export class RollResolver {
  @Query(() => [Roll]) // graph ql type
  rolls(): Promise<Roll[]> {
    console.log("executing");
    // orm type
    return Roll.find();
  }

  @Query(() => Roll, { nullable: true })
  roll(@Arg("id") id: number): Promise<Roll | undefined> {
    return Roll.findOne(id);
  }

  @Mutation(() => Roll)
  async createRoll(
    @Arg("roll") roll: Roll
    // @Ctx() {}: MyContext to bind with our context
  ): Promise<Roll> {
    const newRoll = await Roll.create(roll).save();
    return newRoll;
  }

  @Mutation(() => Roll, { nullable: true })
  async updateRoll(
    @Arg("id") id: number,
    @Arg("name", () => String, { nullable: true }) name: string // pour mettre nullable
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
