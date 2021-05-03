import "reflect-metadata";
import { _prod } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { RollResolver } from "./resolvers/rollResolver";
import { createConnection } from "typeorm";
import { Roll } from "./entities/Roll";

const main = async () => {
  console.log("main started");
  const connection = await createConnection({
    // config orm
    type: "postgres",
    entities: [Roll],
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
      resolvers: [RollResolver],
      validate: false,
    }),
    context: () => ({}), // access db object
  });
  apolloServer.applyMiddleware({ app });

  // app.get("/", (req, res) => res.send("hello")); // api end poinjt classic express
};

main().catch((err) => console.error(err));
