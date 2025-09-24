import {readFileSync} from "node:fs";
import { join } from "path";

const livre = readFileSync(join(__dirname, "livre.gql"), "utf-8");
const auteur = readFileSync(join(__dirname, "auteur.gql"), "utf-8");
const theme = readFileSync(join(__dirname, "theme.gql"), "utf-8");
const pays = readFileSync(join(__dirname, "pays.gql"), "utf-8");
const query = readFileSync(join(__dirname, "query.gql"), "utf-8");
const mutation = readFileSync(join(__dirname, "mutation.gql"), "utf-8");

const schema = `
    # Scalars et types de base d'abord
    scalar DateTime
            
    # Types principaux
    ${theme}
    ${auteur}
    ${pays}
    ${livre}
            
    # Puis Query et Mutation qui référencent ces types
    ${query}
    ${mutation}
`
export default schema;