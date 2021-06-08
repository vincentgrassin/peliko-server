import { User, UserInputType } from "../entities/User";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { Participant } from "../entities/Participant";
import { createQueryBuilder, getConnection } from "typeorm";
import { errorMessages } from "../constants";
import { LoginType } from "../entities/objectType";
import { MyContext } from "../MyContext";
import { createAccessToken, createRefreshToken } from "../auth";
import { isAuth } from "../isAuth";
import { sendRefreshToken } from "../sendRefreshToken";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find();
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    console.log(payload);
    return `${payload?.userId}`;
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

  @Mutation(() => LoginType)
  async login(
    @Arg("password") password: string,
    @Arg("phoneNumber") phoneNumber: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginType> {
    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      throw new Error(errorMessages.unrecognizedUser);
    }
    if (user.password !== password) {
      throw new Error(errorMessages.invalidPassword);
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
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

    if (existingUser) throw new Error(errorMessages.existingUser);

    // salt + hash
    // peut etre bouger le type number de userId a int ? pour regler l'histoire des floats
    // peut être type number est incorrect ???
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

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id") id: number): Promise<boolean> {
    try {
      await User.delete(id);
      return true;
    } catch (e) {
      return false;
    }
  }

  @Mutation(() => Boolean)
  async revokerefreshTokensForUser(
    @Arg("userId") id: number
  ): Promise<boolean> {
    await getConnection()
      .getRepository(User)
      .increment({ id }, "tokenVersion", 1);

    return true;
  }
}
