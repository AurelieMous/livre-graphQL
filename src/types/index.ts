import LivreDB from "../app/datasource/livreDB"
import {Pool, QueryResult} from "pg";

export interface Livre {
    id: number;
    titre: string;
    resume: string;
    dateParution: Date;
    dateParutionFrance: Date;
    auteur_id: number;
    theme_id: number;
    pays_id: number;
    nbPage: number;
    createdAt: Date;
}

export interface Auteur {
    id: number;
    nom: string;
    prenom: string;
    description: string;
    createdAt: Date;
}

export interface Theme {
    id: number;
    titre: string;
    adulte: boolean;
    createdAt: Date;
}

export interface Pays {
    id: number;
    nom: string;
    createdAt: Date;
}

export interface Context {
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

export interface MutationArgs {
    id: number;
    restaurantId: number;
    cookingStyleId: number;
    input: Theme | Livre | Auteur | Pays;
}