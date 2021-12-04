import { User } from "../entities/User";
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

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find();
  }

  @Mutation(() => LoginType)
  async login(
    @Arg("password") password: string,
    @Arg("phoneNumber") phoneNumber: string
  ): Promise<LoginType> {
    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      throw new Error(errorMessages.unrecognizedUser);
    }
    if (user.password !== password) {
      throw new Error(errorMessages.invalidPassword);
    }

    return {
      accessToken: createAccessToken(user),
      refreshToken: createRefreshToken(user),
    };
  }

  @Mutation(() => LoginType)
  async createUser(
    @Arg("name") name: string,
    @Arg("password") password: string,
    @Arg("phoneNumber") phoneNumber: string
  ): Promise<LoginType> {
    const user = { name, password, phoneNumber };
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
    return {
      accessToken: createAccessToken(newUser),
      refreshToken: createRefreshToken(newUser),
    };
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async getUserById(@Ctx() { payload }: MyContext): Promise<User | undefined> {
    if (!payload) {
      throw new Error(errorMessages.unabledToFind);
    }
    const { userId } = payload;
    const user = await createQueryBuilder("user")
      .select("user")
      .from(User, "user")
      .where("user.id = :userId", { userId })
      .getOne();
    return user;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updateUser(
    @Arg("name") name: string,
    @Arg("phoneNumber") phoneNumber: string,
    @Arg("profilePicture") profilePictureId: string,
    @Ctx() { payload }: MyContext
  ): Promise<Boolean> {
    if (!payload) {
      throw new Error(errorMessages.unabledToFind);
    }
    const { userId } = payload;
    const user = await User.findOne(userId);
    if (user) {
      user.avatarCloudinaryPublicId = profilePictureId;
      user.phoneNumber = phoneNumber;
      user.name = name;
      const result = await user.save();
      return !!result;
    }
    return false;
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
