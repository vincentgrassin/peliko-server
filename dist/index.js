"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const rollResolver_1 = require("./resolvers/rollResolver");
const typeorm_1 = require("typeorm");
const Roll_1 = require("./entities/Roll");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("main started");
    const connection = yield typeorm_1.createConnection({
        type: "postgres",
        entities: [Roll_1.Roll],
        database: "peliko2",
        username: "postgres",
        password: "bradgeek91",
        logging: true,
        synchronize: true,
    });
    const app = express_1.default();
    app.listen(4000, () => {
        console.log("server started");
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [rollResolver_1.RollResolver],
            validate: false,
        }),
        context: () => ({}),
    });
    apolloServer.applyMiddleware({ app });
});
main().catch((err) => console.error(err));
//# sourceMappingURL=index.js.map