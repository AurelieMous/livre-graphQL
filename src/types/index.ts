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
    auteur_id: number;    // ← ID de l'auteur en base
    theme_id: number;     // ← ID du thème en base
    pays_id: number;      // ← ID du pays en base
    nbPage: number;
    createdAt: Date;
}

export interface Auteur {
    id: number;
    nom: string;
    prenom: string;
    description: string;
    createdAt: Date;
    livres_id: number;
}

export interface Theme {
    id: number;
    titre: string;
    adulte: boolean;
    createdAt: Date;
    livres_id: number;
}

export interface Pays {
    id: number;
    nom: string;
    createdAt: Date;
    livres_id: number;
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

export interface CreateLivreArgs{
    input: CreateLivreInput;
}

export interface UpdateLivreArgs{
    id: number;
    input: UpdateLivreInput
}

export interface DeleteLivreArgs{
    id: number;
}

export interface CreateLivreInput extends Omit<Livre, 'id' | 'createdAt'> {}
export interface UpdateLivreInput extends CreateLivreInput {}