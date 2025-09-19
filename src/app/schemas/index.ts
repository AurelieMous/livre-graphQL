import {readFileSync} from "node:fs";
import { join } from "path";

const livre = readFileSync(join(__dirname, "livre.gql"), "utf-8");
const auteur = readFileSync(join(__dirname, "auteur.gql"), "utf-8");
const theme = readFileSync(join(__dirname, "theme.gql"), "utf-8");
const pays = readFileSync(join(__dirname, "pays.gql"), "utf-8");
const query = readFileSync(join(__dirname, "query.gql"), "utf-8");

const schema = `
    ${theme}
    ${auteur}
    ${livre}
    ${pays}
    ${query}
`
export default schema;