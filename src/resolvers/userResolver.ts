import { User, UserInputType } from "../entities/User";
import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { Participant } from "../entities/Participant";
import { createQueryBuilder } from "typeorm";
import { userErrorMessages } from "../constants";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  async user(@Arg("id") id: number): Promise<User | undefined> {
    const user = await createQueryBuilder("user")
      .select("user")
      .from(User, "user")
      .where("user.id = :id", { id })
      .getOne();

    return user;
  }

  @Mutation(() => User)
  async createUser(@Arg("user") user: UserInputType): Promise<User> {
    const existingUser = await createQueryBuilder("user")
      .select("user")
      .from(User, "user")
      .where("user.phoneNumber = :phoneNumber", {
        phoneNumber: user.phoneNumber,
      })
      .getOne();

    if (existingUser) throw new Error(userErrorMessages.existing);

    const newUser = await User.create({
      ...user,
    }).save();
    const participations = await createQueryBuilder("participant")
      .select("participant")
      .from(Participant, "participant")
      .where("participant.phoneNumber = :phoneNumber", {
        phoneNumber: user.phoneNumber,
      })
      .getMany();
    participations.forEach((p) => {
      p.userId = newUser.id;
      p.save();
    });
    return newUser;
  }

  //   @Mutation(() => User, { nullable: true })
  //   async updateUser(
  //     @Arg("UserData") userData: UserInputType
  //   ): Promise<User | undefined> {
  //     return User;
  //   }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id") id: number): Promise<boolean> {
    try {
      await User.delete(id);
      return true;
    } catch (e) {
      return false;
    }
  }
}
