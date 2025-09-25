// Import du DataMapper de base contenant les opérations CRUD génériques
import CoreDatamapper from "./codeDataMapper";
// Import des types TypeScript pour assurer la cohérence des données
import { Livre as ILivre, LivreDBConfig, Pagination} from "../../../types";
// Import de DataLoader pour résoudre le problème N+1 des requêtes GraphQL
import DataLoader from "dataloader";
import {transformObjectKeys} from "../../resolvers/utils/caseTransform";

/**
 * DataSource Livre - Spécialisation du CoreDatamapper
 *
 * Cette classe gère spécifiquement les opérations sur la table "livre".
 * Elle hérite des opérations CRUD de base et ajoute :
 * - Des requêtes spécialisées (par auteur, thème, pays)
 * - Des DataLoaders pour optimiser les requêtes en batch
 * - Une gestion intelligente du cache via le CoreDatamapper
 */
class Livre extends CoreDatamapper<ILivre>{
    // Configuration spécifique à la table livre
    tableName = "livre";
    defaultOrderBy = "titre"; // Tri alphabétique par défaut

    // DataLoaders pour optimiser les requêtes groupées et éviter le problème N+1
    // Chaque DataLoader accumule les requêtes similaires et les exécute en une seule fois

    /**
     * DataLoader pour récupérer les livres par auteur
     * Résout le problème N+1 quand on veut les livres de plusieurs auteurs
     */
    findByAuteurLoader: DataLoader<
        { auteurId: number; pagination: Pagination }, // Type de clé : ID auteur + paramètres de pagination
        ILivre[] // Type de retour : tableau de livres
    >;

    /**
     * DataLoader pour récupérer les livres par thème
     * Optimise les requêtes quand on charge les livres de plusieurs thèmes
     */
    findByThemeLoader: DataLoader<
        { themeId: number; pagination: Pagination }, // Type de clé : ID thème + paramètres de pagination
        ILivre[] // Type de retour : tableau de livres
    >

    /**
     * DataLoader pour récupérer les livres par pays
     * Évite les requêtes multiples pour les livres de différents pays
     */
    findByPaysLoader: DataLoader<
        { paysId: number; pagination: Pagination }, // Type de clé : ID pays + paramètres de pagination
        ILivre[] // Type de retour : tableau de livres
    >

    constructor(options: LivreDBConfig) {
        // Appel du constructeur parent pour initialiser le client DB et le cache
        super(options);

        /**
         * Configuration du DataLoader pour les livres par auteur
         *
         * Stratégie : Grouper toutes les demandes de livres par auteur en une seule requête
         * qui récupère tous les livres de tous les auteurs demandés, puis redistribue
         * les résultats selon l'auteur correspondant.
         */
        this.findByAuteurLoader = new DataLoader(async keys => {
            // Extraction de tous les IDs d'auteurs demandés dans ce batch
            const auteurIds = keys.map(key => key.auteurId);

            // Utilisation des paramètres de pagination du premier élément
            // (limitation : assume que tous les éléments du batch ont la même pagination)
            const { limit, offset, orderBy, direction } = this.preparePaginationParams(keys[0].pagination);

            // Requête SQL optimisée utilisant une window function pour paginer par auteur
            const preparedQuery = {
                text:`
                SELECT *
                FROM (
                    SELECT *,
                           ROW_NUMBER() OVER (
                           PARTITION BY auteur_id  -- Numérotation séparée pour chaque auteur
                           ORDER BY "${orderBy}" ${direction}
                           ) AS row_num
                    FROM "${this.tableName}"
                    WHERE auteur_id = ANY($1)  -- Filtre sur tous les auteurs demandés
                     ) AS subquery
                WHERE row_num BETWEEN ($3 + 1) AND ($3 + $2)  -- Pagination basée sur row_num
                `,
                values: [auteurIds, limit, offset]
            };

            // Utilisation du cache pour cette requête complexe
            const results = await this.cacheQuery(preparedQuery);

            // Redistribution des résultats : chaque auteur reçoit ses livres
            return auteurIds.map(auteurId =>
                results.filter(row => row.auteurId === auteurId));
        });

        /**
         * Configuration du DataLoader pour les livres par thème
         * Même principe que pour les auteurs mais filtré par theme_id
         */
        this.findByThemeLoader = new DataLoader(async keys => {
            const themesIds = keys.map(key => key.themeId);
            const { limit, offset, orderBy, direction } =
                this.preparePaginationParams(keys[0].pagination);
            const preparedQuery = {
                text: `
                    WITH ranked_livres AS (
                      SELECT 
                        r.*, 
                        rcs.theme_id,
                        ROW_NUMBER() OVER (
                          PARTITION BY rcs.theme_id 
                          ORDER BY r.${orderBy} ${direction}
                        ) AS row_num
                      FROM livre r
                      JOIN livre_theme rcs 
                        ON r.id = rcs.livre_id
                      WHERE rcs.theme_id = ANY($1)
                    )
                    SELECT *
                    FROM ranked_livres
                    WHERE row_num BETWEEN ($2 + 1) AND ($2 + $3)`,
                values: [themesIds, limit, offset],
            };
            const results = await this.cacheQuery(preparedQuery);
            return themesIds.map(themeId =>
                results.filter(row => row.themeId === themeId)
            );
        });

        /**
         * Configuration du DataLoader pour les livres par pays
         * Même principe que pour les autres, filtré par pays_id
         */
        this.findByPaysLoader = new DataLoader(async keys => {
            const paysIds = keys.map(key => key.paysId);
            const { limit, offset, orderBy, direction } = this.preparePaginationParams(keys[0].pagination);

            // ATTENTION : Bug dans la requête SQL - utilise auteur_id au lieu de pays_id
            const preparedQuery = {
                text:`
                SELECT *
                FROM (
                    SELECT *,
                           ROW_NUMBER() OVER (
                           PARTITION BY pays_id  -- CORRECTION: devrait être pays_id, pas auteur_id
                           ORDER BY "${orderBy}" ${direction}
                           ) AS row_num
                    FROM "${this.tableName}"
                    WHERE pays_id = ANY($1)  -- CORRECTION: devrait être pays_id
                     ) AS subquery
                WHERE row_num BETWEEN ($3 + 1) AND ($3 + $2)
                `,
                values: [paysIds, limit, offset]
            };

            const results = await this.cacheQuery(preparedQuery);

            // Redistribution par pays_id
            return paysIds.map(paysId =>
                results.filter(row => row.paysId === paysId));
        });
    }

    // ========== MÉTHODES SPÉCIALISÉES ==========
    // Ces méthodes complètent les opérations CRUD de base du CoreDatamapper
    // avec des requêtes métier spécifiques aux livres

    /**
     * Récupère les livres d'un auteur spécifique avec pagination
     *
     * Utilisée pour les requêtes directes (non optimisées par DataLoader)
     * Idéale pour les requêtes uniques ou quand on n'a pas besoin du batching
     *
     * @param auteurId Identifiant de l'auteur
     * @param pagination Paramètres de pagination
     * @returns Liste paginée des livres de cet auteur
     */

    async findByAuteur(auteurId: number, pagination: Pagination) {
        const { limit, offset, orderBy, direction } = this.preparePaginationParams(pagination);

        const preparedQuery = {
            text: `SELECT * FROM "${this.tableName}"
                   WHERE auteur_id = $1
                   ORDER BY "${orderBy}" ${direction} 
               LIMIT $2 OFFSET $3`,
            values: [auteurId, limit, offset],
        };

        // Exécution directe sans cache (pourrait être optimisée avec this.cacheQuery)
        const results = await this.client.query(preparedQuery);
        return transformObjectKeys(results.rows);
    }

    /**
     * Récupère les livres d'un thème spécifique avec pagination
     *
     * @param themeId Identifiant du thème
     * @param pagination Paramètres de pagination
     * @returns Liste paginée des livres de ce thème
     */
    async findByTheme(themeId: number, pagination: Pagination) {
        const { limit, offset, orderBy, direction } = this.preparePaginationParams(pagination);

        const preparedQuery = {
            text: `SELECT * FROM "${this.tableName}"
                   WHERE theme_id = $1
                   ORDER BY "${orderBy}" ${direction}
            LIMIT $2 OFFSET $3`,
            values: [themeId, limit, offset],
        }

        // Exécution directe sans cache
        const results = await this.client.query(preparedQuery);
        return results.rows;
    }

    /**
     * Récupère les livres d'un pays spécifique avec pagination
     *
     * @param payId Identifiant du pays
     * @param pagination Paramètres de pagination
     * @returns Liste paginée des livres de ce pays
     */
    async findByPays(payId: number, pagination: Pagination) {
        const { limit, offset, orderBy, direction } = this.preparePaginationParams(pagination);

        // ATTENTION : Bug dans ORDER BY - utilise payId au lieu de orderBy
        const preparedQuery = {
            text: `SELECT * FROM "${this.tableName}"
                   WHERE pays_id = $1
                   ORDER BY "${orderBy}" ${direction}  -- CORRECTION: devrait être orderBy, pas payId
            LIMIT $2 OFFSET $3`,
            values: [payId, limit, offset],
        }

        // Exécution directe sans cache
        const results = await this.client.query(preparedQuery);
        return results.rows;
    }

    async associateWithTheme(livreId: number, themesId: number) {
        const preparedQuery = {
            text: `INSERT INTO livre_theme (livre_id, theme_id) VALUES ($1, $2)`,
            values: [livreId, themesId]
        }
        await this.client.query(preparedQuery);
        const livre = await this.findByPk(livreId);
        return livre;
    }

}

export default Livre;