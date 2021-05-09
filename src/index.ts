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

const main = async () => {
  console.log("main started");
  const connection = await createConnection({
    type: "postgres",
    entities: [Roll, Participant, User],
    database: "peliko2",
    username: "postgres",
    password: "bradgeek91",
    logging: true,
    synchronize: true,
  });

  const app = express(); // init server
  app.listen(4000, () => {
    console.log("server started");
  });

  const apolloServer = new ApolloServer({
    // init apollo server
    schema: await buildSchema({
      // build graphql schema
      resolvers: [RollResolver, UserResolver],
      validate: false,
    }),
    context: () => ({}), // bind a context if needed
  });
  apolloServer.applyMiddleware({ app });
};

main().catch((err) => console.error(err));
