import { Livre as ILivre, Pagination, Pays} from "../../types";
import {Context} from "node:vm";

const resolvers = {
    /**
     * 🚀 UTILISATION DE VOTRE DATALOADER findByPaysLoader
     *
     * Même principe que pour Auteur :
     * - Query: { pays { nom, livres { titre } } }
     * - Sans DataLoader: 1 + N requêtes
     * - Avec DataLoader: 2 requêtes seulement
     */
    livres: async (
        parent: Pays, pagination: Pagination, {datasource}: Context
    ): Promise<ILivre[]> => {
        return await datasource.livreDB.livre.findByPaysLoader.load({
            paysId: parent.id,
            pagination: pagination || {limit: 10, offset: 0}
        });
    },
}

export default resolvers;