import "dotenv/config";
import "reflect-metadata";
import cookieParser from "cookie-parser";
import { _prod } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { Roll } from "./entities/Roll";
import { RollResolver } from "./resolvers/rollResolver";
import { Participant } from "./entities/Participant";
import { ParticipantResolver } from "./resolvers/participantResolver";
import { User } from "./entities/User";
import { UserResolver } from "./resolvers/userResolver";
import { Picture } from "./entities/Picture";
import { PictureResolver } from "./resolvers/pictureResolver";
import { verify } from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";

const main = async () => {
  console.log("main started");
  const connection = await createConnection({
    type: "postgres",
    entities: [Roll, Participant, User, Picture],
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    logging: true,
    synchronize: true,
  });

  const app = express();
  app.use(cookieParser());
  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (e) {
      console.log(e);
      return res.send({ ok: false, accessToken: "" });
    }
    const user = await User.findOne({ id: payload.userId });
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));
    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  app.listen(4000, () => {
    console.log("server started");
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        RollResolver,
        UserResolver,
        PictureResolver,
        ParticipantResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  });
  apolloServer.applyMiddleware({ app });
};

main().catch((err) => console.error(err));
