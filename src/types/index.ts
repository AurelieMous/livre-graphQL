import LivreDB from "../app/datasource/livreDB"
import {Pool, QueryResult} from "pg";
import {KeyValueCache} from "@apollo/utils.keyvaluecache";
import {BaseContext} from "@apollo/server";

export interface Livre {
    id: number;
    titre: string;
    resume: string;
    dateParution: Date;
    dateParutionFrance: Date;
    auteurId: number;
    themeId: number;
    paysId: number;
    nbPage: number;
    createdAt: Date;
}

export interface Auteur {
    id: number;
    nom: string;
    prenom: string;
    description: string;
    createdAt: Date;
    livreId: number;
}

export interface Theme {
    id: number;
    titre: string;
    adulte: boolean;
    createdAt: Date;
    livreId: number;
}

export interface Pays {
    id: number;
    nom: string;
    createdAt: Date;
    livreId: number;
}

export interface Context extends BaseContext {
    datasource : {
        livreDB: LivreDB
    }
}

export interface DatabaseClient {
    originalClient: Pool;
    query(query: { text: string; values: unknown[] }): Promise<QueryResult>;
}

export interface LivreDBConfig {
    client: DatabaseClient;
    cache: KeyValueCache<string>;
}

export interface QueryArgs {
    id: number;
    pagination: Pagination;
}

export interface Pagination {
    limit: number;
    offset: number;
    orderBy: string;
    direction: string;
}

export interface DeleteLivreArgs{
    id: number;
}

export interface MutationArgs {
    id: number;
    livreId: number;
    themeId: number;
    input: Livre;
}