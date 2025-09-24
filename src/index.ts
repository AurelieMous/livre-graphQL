import {ApolloServer} from "@apollo/server";
import { Context } from "./types";
import LivreDB from './app/datasource/livreDB';
import {startStandaloneServer} from "@apollo/server/standalone";
import debug from "debug";
import typeDefs from "./app/schemas"
import resolvers from "./app/resolvers";
import DBClient from "./app/datasource/livreDB/db/pg"

import Keyv from "keyv";
import KeyvRedis from "@keyv/redis";
import { KeyvAdapter } from "@apollo/utils.keyvadapter"
import {ApolloServerPluginCacheControl} from "@apollo/server/dist/esm/plugin/cacheControl";

const PORT = 3000;

const logger = debug("app:server");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    cache: new KeyvAdapter(new Keyv(new KeyvRedis("redis://livres-redis:6379"))),
    plugins: [
        ApolloServerPluginCacheControl({
            defaultMaxAge: 300,
        }),
    ]
});

async function createContext() : Promise<Context> {
    const { cache } = server;
    return {
        datasource: {
            livreDB: new LivreDB({client: DBClient, cache}),
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