import {QueryArgs} from "../../types";
import {Context} from "node:vm";
import {ensureEntityExists} from "./utils/error404Handler";

const resolvers = {
    // Livres
    livres: async (_:undefined, { pagination }: QueryArgs, { datasource }: Context) => {
        const livres = await datasource.livreDB.livre.findAll(pagination);
        return livres;
    },
    livre: async (_:undefined, { id }: QueryArgs, { datasource }: Context) => {
        const livre = await datasource.livreDB.livre.findByPk(id);
        return ensureEntityExists(livre, "Livre");
    },

    // Auteur
    auteurs: async (_:undefined, { pagination }: QueryArgs, { datasource }: Context) => {
        const auteurs = await datasource.livreDB.auteur.findAll(pagination);
        return auteurs;
    },
    auteur: async (_:undefined, { id }: QueryArgs, { datasource }: Context) => {
        const auteur = await datasource.livreDB.auteur.findByPk(id);
        return ensureEntityExists(auteur, "Auteur");
    },

    // Themes
    themes: async (_:undefined, { pagination }: QueryArgs, { datasource }: Context) => {
        const themes = await datasource.livreDB.theme.findAll(pagination);
        return themes;
    },
    theme: async (_:undefined, { id }: QueryArgs, { datasource }: Context) => {
        const theme = await datasource.livreDB.theme.findByPk(id);
        return ensureEntityExists(theme, "Theme");
    },

    // Pays
    payss: async (_:undefined, { pagination }: QueryArgs, { datasource }: Context) => {
        const payss = await datasource.livreDB.pays.findAll(pagination);
        return payss;
    },
    pays: async (_:undefined, { id }: QueryArgs, { datasource }: Context) => {
        const pays = await datasource.livreDB.pays.findByPk(id);
        return ensureEntityExists(pays, "Pays");
    },
}

export default resolvers;