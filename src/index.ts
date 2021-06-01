import "dotenv/config";
import "reflect-metadata";
import { _prod } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { RollResolver } from "./resolvers/rollResolver";
import { createConnection } from "typeorm";
import { Roll } from "./entities/Roll";
import { Participant } from "./entities/Participant";
import { User } from "./entities/User";
import { UserResolver } from "./resolvers/userResolver";
import { PictureResolver } from "./resolvers/pictureResolver";
import { Picture } from "./entities/Picture";

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
  app.listen(4000, () => {
    console.log("server started");
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [RollResolver, UserResolver, PictureResolver],
      validate: false,
    }),
    context: () => ({}), // bind a context if needed
  });
  apolloServer.applyMiddleware({ app });
};

main().catch((err) => console.error(err));
