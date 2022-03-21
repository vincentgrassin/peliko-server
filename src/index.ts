import "dotenv/config";
import "reflect-metadata";
import { _prod } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { RollResolver } from "./resolvers/rollResolver";
import { ParticipantResolver } from "./resolvers/participantResolver";
import { User } from "./entities/User";
import { UserResolver } from "./resolvers/userResolver";
import { PictureResolver } from "./resolvers/pictureResolver";
import { verify } from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "./auth";
import bodyParser from "body-parser";

const main = async () => {
  const ormConfig = require("./ormConfig");
  await createConnection(ormConfig);

  const app = express();

  app.use(bodyParser());

  app.post("/refresh_token", async (req, res) => {
    const token = req.body.refreshToken;
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

    return res.send({
      ok: true,
      accessToken: createAccessToken(user),
      refreshToken: createRefreshToken(user),
    });
  });

  app.listen(process.env.PORT || 4000, () => {
    console.log("server started on ", process.env.PORT || 4000);
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
  apolloServer.applyMiddleware({
    app,
    // cors: false,
  });
};

main().catch((err) => console.error(err));
