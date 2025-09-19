// Import des types TypeScript pour assurer la cohérence des données
import {Livre, Context, Auteur, Theme, Pays} from "../../types";

/**
 * Resolvers GraphQL pour l'entité Livre
 *
 * Ces resolvers gèrent les champs relationnels de l'entité Livre.
 * Ils sont appelés automatiquement par GraphQL quand un client demande
 * ces champs spécifiques dans une requête sur un livre.
 *
 * Pattern N+1 : Attention, ces resolvers peuvent créer des problèmes de performance
 * si de nombreux livres sont récupérés, car chaque relation génère une requête DB.
 * Solution : utiliser des DataLoaders pour le batching.
 */
const resolvers = {
    /**
     * Resolver pour le champ 'auteur' d'un Livre
     *
     * Récupère les informations complètes de l'auteur à partir de son ID
     * stocké dans l'entité Livre.
     *
     * @param parent L'objet Livre parent contenant l'auteurId
     * @param _ Arguments de la requête (non utilisés ici)
     * @param datasource Context GraphQL contenant les sources de données
     * @returns Promise<Auteur> Les données complètes de l'auteur
     */
    auteur: async (parent: Livre, _: undefined, { datasource }: Context): Promise<Auteur> => {
        // Récupération de l'auteur via son ID stocké dans le livre
        const auteur = await datasource.livreDB.auteur.findByPk(parent.auteur_id);
        // Cast explicite vers le type Auteur (à éviter si possible, mieux vaut typer correctement)
        return auteur as Auteur;
    },

    /**
     * Resolver pour le champ 'theme' d'un Livre
     *
     * Récupère les informations du thème/genre du livre
     *
     * @param parent L'objet Livre parent contenant le themeId
     * @param _ Arguments de la requête (non utilisés)
     * @param datasource Context contenant l'accès aux datamappers
     * @returns Promise<Theme> Les données du thème
     */
    themes: async (parent: Livre, _: undefined, { datasource }: Context): Promise<Theme[]> => {
        const theme = await datasource.livreDB.theme.findByPk(parent.theme_id);
        return theme ? [theme] : []; // ← Toujours retourner un tableau
    },

    /**
     * Resolver pour le champ 'pays' d'un Livre
     *
     * Récupère les informations du pays de publication/origine du livre
     *
     * @param parent L'objet Livre parent contenant le paysId
     * @param _ Arguments non utilisés
     * @param datasource Context GraphQL avec les sources de données
     * @returns Promise<Pays> Les données du pays
     */
    pays: async (parent: Livre, _: undefined, { datasource }: Context): Promise<Pays> => {
        // Récupération des données complètes du pays
        const pays = await datasource.livreDB.pays.findByPk(parent.pays_id);
        return pays as Pays;
    }
}

export default resolvers;