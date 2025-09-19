import {ApolloServer} from "@apollo/server";
import { Context } from "./types";
import LivreDB from './app/datasource/livreDB';
import {startStandaloneServer} from "@apollo/server/standalone";
import debug from "debug";
import typeDefs from "./app/schemas"
import resolvers from "./app/resolvers";

const PORT = 3000;

const logger = debug("app:server");

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

async function createContext() : Promise<Context> {
    return {
        datasource: {
            livreDB: new LivreDB(),
        },
    };
}

startStandaloneServer(server, {
    listen: {
        port: PORT,
    },
    context: createContext,
}).then(({url}) => {
    logger(`🚀  Server GraphQL listening on ${url}`);
});