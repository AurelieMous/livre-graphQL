// Import des types TypeScript pour le typage des arguments et du contexte
import {Context, CreateLivreArgs, DeleteLivreArgs, UpdateLivreArgs} from "../../types";
import resolvers from "./index";

// Objet contenant tous les resolvers pour les mutations liées aux livres
const resolver = {
    /**
     * Mutation pour créer un nouveau livre
     * @param _ - Parent (non utilisé pour les mutations racine)
     * @param args - Arguments contenant les données du livre à créer (CreateLivreInput)
     * @param datasource - Context GraphQL avec accès aux sources de données
     * @returns Le livre créé avec son ID généré
     */
    createLivre: async(_: undefined, args: CreateLivreArgs, { datasource }: Context) => {
        // Appel à la couche de données pour créer le livre en base
        const livre = await datasource.livreDB.livre.create(args.input);
        return livre;
    },

    /**
     * Mutation pour mettre à jour un livre existant
     * @param _ - Parent (non utilisé pour les mutations racine)
     * @param args - Arguments contenant l'ID du livre et les données à modifier
     * @param datasource - Context GraphQL avec accès aux sources de données
     * @returns Le livre mis à jour
     */
    updateLivre: async(_: undefined, args: UpdateLivreArgs, { datasource }: Context) => {
        // Appel à la couche de données pour modifier le livre
        // args.input peut être undefined (champs optionnels)
        const livre = await datasource.livreDB.livre.update(
            args.id, args.input
        );
        return livre;
    },

    /**
     * Mutation pour supprimer un livre
     * @param _ - Parent (non utilisé pour les mutations racine)
     * @param args - Arguments contenant l'ID du livre à supprimer
     * @param datasource - Context GraphQL avec accès aux sources de données
     * @returns Boolean indiquant si la suppression a réussi
     */
    deleteLivre: async(_: undefined, args: DeleteLivreArgs, { datasource }: Context) => {
        // Appel à la couche de données pour supprimer le livre
        const isDeleted = await datasource.livreDB.livre.delete(args.id);
        return isDeleted;
    }
}

// Export du resolver pour l'utiliser dans la configuration GraphQL
export default resolver;