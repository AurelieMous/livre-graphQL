// Import du DataMapper de base qui contient la logique commune
import CoreDatamapper from "./codeDataMapper";
// Import des types TypeScript pour assurer la cohérence des données
import {LivreDBConfig, Theme as ITheme} from "../../../types"
// Import de DataLoader pour optimiser les requêtes et éviter le problème N+1
import DataLoader from "dataloader";

/**
 * DataMapper pour l'entité Theme
 *
 * Hérite de CoreDatamapper et ajoute des fonctionnalités spécifiques aux themes,
 * notamment la gestion optimisée des relations Many-to-Many avec les livres.
 */
class Theme extends CoreDatamapper<ITheme>{
    // Nom de la table dans la base de données
    tableName = "theme";

    // Tri par défaut appliqué aux requêtes (alphabétique par titre)
    defaultOrderBy = "titre";

    // DataLoader pour optimiser la récupération des themes par livre
    // Évite le problème N+1 en regroupant les requêtes
    findByLivreLoader: DataLoader<number, ITheme[] | null>;

    /**
     * Constructeur de la classe Theme
     *
     * @param options Configuration de la base de données (connexion, cache, etc.)
     */
    constructor(options: LivreDBConfig) {
        // Appel du constructeur parent pour initialiser la connexion DB
        super(options);

        /**
         * Configuration du DataLoader pour les relations livre -> themes
         *
         * Le DataLoader regroupe automatiquement les requêtes multiples en une seule
         * pour améliorer les performances lors de la résolution GraphQL.
         *
         * Fonctionnement :
         * - Collecte tous les IDs de livres demandés
         * - Exécute une seule requête avec tous les IDs
         * - Redistribue les résultats selon les clés demandées
         */
        this.findByLivreLoader = new DataLoader(async keys => {
            // Requête SQL optimisée avec JOIN pour récupérer tous les themes
            // liés aux livres demandés en une seule fois
            const preparedQuery = {
                text: `
                        SELECT cs.*, rcs.livre_id FROM ${this.tableName} cs
                        JOIN livre_theme rcs ON rcs.theme_id = cs.id
                        WHERE rcs.livre_id = ANY($1)`, // ANY permet de passer un tableau d'IDs
                values: [keys], // keys contient tous les IDs de livres demandés
            };

            // Exécution de la requête avec mise en cache si disponible
            const results = await this.cacheQuery(preparedQuery);

            // Gestion du cas où aucun résultat n'est trouvé
            if (!results) {
                // Retourner null pour chaque clé demandée
                return keys.map(() => null);
            }

            /**
             * Redistribution des résultats par livre
             *
             * DataLoader s'attend à recevoir un tableau de résultats
             * dans le même ordre que les clés demandées.
             * On filtre les résultats pour chaque livre_id.
             */
            return keys.map(livreId =>
                results.filter(row => row.livre_id === livreId)
            );
        });
    }

    /**
     * Méthode publique pour récupérer les themes d'un livre
     *
     * Utilise le DataLoader pour optimiser les performances.
     * Cette méthode sera appelée par les resolvers GraphQL.
     *
     * @param livreId ID du livre dont on veut récupérer les themes
     * @returns Promise<ITheme[] | null> Liste des themes ou null si aucun
     */
    async findByLivre(livreId: number) {
        return this.findByLivreLoader.load(livreId);
    }
}

export default Theme;