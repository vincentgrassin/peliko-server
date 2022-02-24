import { User } from "../entities/User";
import { UserViewModel } from "../viewModels/UserViewModel";
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
import { LoginInputViewModel } from "../viewModels/LoginInputViewModel";
import { MyContext } from "../MyContext";
import { createAccessToken, createRefreshToken } from "../auth";
import { isAuth } from "../isAuth";
import {
  findUserById,
  findUserByPhoneNumber,
  throwDatabaseError,
} from "./queriesHelpers";
import { AuthenticationError } from "apollo-server-express";

@Resolver()
export class UserResolver {
  @Query(() => [UserViewModel])
  users(): Promise<UserViewModel[]> {
    return User.find();
  }

  @Mutation(() => LoginInputViewModel)
  async login(
    @Arg("password") password: string,
    @Arg("phoneNumber") phoneNumber: string
  ): Promise<LoginInputViewModel> {
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

  @Mutation(() => LoginInputViewModel)
  async createUser(
    @Arg("name") name: string,
    @Arg("password") password: string,
    @Arg("phoneNumber") phoneNumber: string
  ): Promise<LoginInputViewModel> {
    const user = { name, password, phoneNumber };
    const existingUser = await findUserByPhoneNumber(phoneNumber);

    if (existingUser) throw new Error(errorMessages.existingUser);

    const newUser = await User.create({
      ...user,
    })
      .save()
      .catch(throwDatabaseError);
    const participations = await createQueryBuilder("participant")
      .select("participant")
      .from(Participant, "participant")
      .where("participant.phoneNumber = :phoneNumber", {
        phoneNumber: user.phoneNumber,
      })
      .getMany();
    participations.forEach((p) => {
      p.userId = newUser.id;
      p.save().catch(throwDatabaseError);
    });
    return {
      accessToken: createAccessToken(newUser),
      refreshToken: createRefreshToken(newUser),
    };
  }

  @Query(() => UserViewModel, { nullable: true })
  @UseMiddleware(isAuth)
  async getUserById(
    @Ctx() { payload }: MyContext
  ): Promise<UserViewModel | undefined> {
    if (!payload) {
      throw new AuthenticationError(errorMessages.unauthorized);
    }
    const { userId } = payload;
    const user = await findUserById(userId);
    return user;
  }

  @Mutation(() => UserViewModel)
  @UseMiddleware(isAuth)
  async updateUser(
    @Arg("name") name: string,
    @Arg("phoneNumber") phoneNumber: string,
    @Arg("profilePicture") profilePictureId: string,
    @Ctx() { payload }: MyContext
  ): Promise<UserViewModel | undefined> {
    if (!payload) {
      throw new AuthenticationError(errorMessages.unauthorized);
    }
    const { userId } = payload;
    const user = await User.findOne(userId);
    if (!user) {
      throw new Error(errorMessages.unabledToFind);
    }
    let existingUser;
    if (user.phoneNumber != phoneNumber) {
      existingUser = await findUserByPhoneNumber(phoneNumber);
    }
    if (existingUser) {
      throw new Error(errorMessages.existingUser);
    } else {
      user.avatarCloudinaryPublicId = profilePictureId;
      user.phoneNumber = phoneNumber;
      user.name = name;
      const result = await user.save().catch(throwDatabaseError);
      return result;
    }
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

  @Query(() => [UserViewModel], { nullable: true })
  @UseMiddleware(isAuth)
  async getUsersByIds(
    @Arg("ids", () => [Number]) ids: number[],
    @Ctx() { payload }: MyContext
  ): Promise<UserViewModel[] | undefined> {
    if (!payload) {
      throw new AuthenticationError(errorMessages.unauthorized);
    }
    const users = await Promise.all(
      ids.map(async (id) => {
        const user = await findUserById(id);
        return user;
      })
    );
    const existingUsers = users.filter(Boolean) as User[];
    return existingUsers;
  }
}
