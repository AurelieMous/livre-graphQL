// Import des types TypeScript pour le typage des arguments et du contexte
import {Context, DeleteLivreArgs, MutationArgs} from "../../types";
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
    createLivre: async(_: undefined, args: MutationArgs, { datasource }: Context) => {
        console.log('=== DONNÉES REÇUES ===');
        console.log('Input original:', args.input);

        const dbData = {
            titre: args.input.titre,
            resume: args.input.resume,
            date_parution: args.input.dateParution,
            date_parution_france: args.input.dateParutionFrance,
            nb_page: args.input.nbPage,
            auteur_id: args.input.auteur_id,
            pays_id: args.input.pays_id,
            created_at: new Date()
        };

        console.log('=== DONNÉES CONVERTIES POUR LA DB ===');
        console.log('dbData:', dbData);

        const livre = await datasource.livreDB.livre.create(
            dbData,
        )

        console.log('=== RÉSULTAT BRUT DE LA DB ===');
        console.log('Result:', livre);

        return await datasource.livreDB.livre.findByPk(livre.id)
    },

    /**
     * Mutation pour mettre à jour un livre existant
     * @param _ - Parent (non utilisé pour les mutations racine)
     * @param args - Arguments contenant l'ID du livre et les données à modifier
     * @param datasource - Context GraphQL avec accès aux sources de données
     * @returns Le livre mis à jour
     */
    updateLivre: async(_: undefined, args: MutationArgs, { datasource }: Context) => {
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
    deleteLivre: async(_: undefined, args: MutationArgs, { datasource }: Context) => {
        // Appel à la couche de données pour supprimer le livre
        const isDeleted = await datasource.livreDB.livre.delete(args.id);
        return isDeleted;
    },

    associateLivreWithTheme: async(
        _: undefined,
        { livreId, themeId }: MutationArgs,
        { datasource }: Context
    ) => {
        const livre =
            await datasource.livreDB.livre.associateWithTheme(
                livreId,
                themeId,
            );
        return livre;
    }
}

// Export du resolver pour l'utiliser dans la configuration GraphQL
export default resolver;