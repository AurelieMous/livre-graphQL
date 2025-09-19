import {ApolloServer} from "@apollo/server";
import { Context } from "./types";
import BookDB from './app/datasource/bookDB';
import {startStandaloneServer} from "@apollo/server/standalone";
import {debug} from "node:util";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

const logger = debug("app:server");

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

async function createContext() : Promise<Context> {
    return {
        datasources: {
            restoDB: new BookDB(),
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