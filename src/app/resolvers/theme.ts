import {Theme, Livre as ILivre, Pagination} from "../../types";
import {Context} from "node:vm";

const resolvers = {
    /**
     * 🚀 UTILISATION DE VOTRE DATALOADER findByThemeLoader
     *
     * Même principe que pour Auteur :
     * - Query: { themes { nom, livres { titre } } }
     * - Sans DataLoader: 1 + N requêtes
     * - Avec DataLoader: 2 requêtes seulement
     */
    livres: async (
        parent: Theme, pagination: Pagination, {datasource}: Context
    ): Promise<ILivre[]> => {
        return await datasource.livreDB.livre.findByThemeLoader.load({
            themeId: parent.id,
            pagination: pagination || {limit: 10, offset: 0}
        });
    },
}

export default resolvers;