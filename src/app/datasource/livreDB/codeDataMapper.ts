// Import de la configuration générale de l'application (limites de pagination, etc.)
import config from "./config";
// Import des types TypeScript pour la cohérence du code
import { DatabaseClient, Pagination, LivreDBConfig } from "../../../types";

/**
 * Classe abstraite CoreDatamapper - Pattern Data Mapper
 *
 * Fournit les opérations CRUD de base pour toutes les entités de l'application.
 * Chaque entité (Livre, Auteur, Theme, etc.) hérite de cette classe et
 * implémente ses spécificités (nom de table, tri par défaut).
 *
 * @template T - Type générique représentant l'entité manipulée
 */
abstract class CoreDatamapper<T> {
    // Nom de la table en base - doit être défini par chaque classe fille
    protected abstract tableName: string;

    // Champ de tri par défaut - doit être défini par chaque classe fille
    protected abstract defaultOrderBy: string;

    // Client de base de données injecté pour exécuter les requêtes
    protected client: DatabaseClient;

    /**
     * Constructeur - Injection de dépendance du client DB
     * @param options Configuration contenant le client de base de données
     */
    constructor(options: LivreDBConfig) {
        if (!options.client) {
            throw new Error("client is required");
        }
        this.client = options.client;
    }

    /**
     * Récupère une entité par sa clé primaire
     * @param id Identifiant unique de l'entité
     * @returns L'entité trouvée ou null si inexistante
     */
    async findByPk(id: number): Promise<T | null> {
        // Requête préparée pour éviter les injections SQL
        const preparedQuery = {
            text: `SELECT * FROM "${this.tableName}" WHERE id = $1`,
            values: [id], // Paramètre sécurisé
        };
        const result = await this.client.query(preparedQuery);

        // Retourne la première ligne ou null si aucun résultat
        return result.rows[0] ? result.rows[0] : null;
    }

    /**
     * Récupère toutes les entités avec pagination
     * @param pagination Paramètres de pagination (limite, offset, tri)
     * @returns Tableau des entités paginées
     */
    async findAll(pagination: Pagination): Promise<T[]> {
        // Normalisation et validation des paramètres de pagination
        const { limit, offset, orderBy, direction } =
            this.preparePaginationParams(pagination);

        const preparedQuery = {
            text: `SELECT * FROM "${this.tableName}" ORDER BY "${orderBy}" ${direction} LIMIT $1 OFFSET $2`,
            values: [limit, offset],
        };
        const result = await this.client.query(preparedQuery);
        return result.rows;
    }

    /**
     * Crée une nouvelle entité en base
     * @param data Objet contenant les données à insérer
     * @returns L'entité créée avec son ID généré
     */
    async create(data: object): Promise<T> {
        // Extraction des clés et valeurs de l'objet
        const keys = Object.keys(data);
        const values = Object.values(data);

        // Génération des placeholders ($1, $2, $3...)
        const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");

        const preparedQuery = {
            // RETURNING * retourne l'entité créée avec l'ID auto-généré
            text: `INSERT INTO "${this.tableName}" (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`,
            values,
        };
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    }

    /**
     * Met à jour une entité existante
     * @param id Identifiant de l'entité à modifier
     * @param data Nouvelles données à appliquer
     * @returns L'entité modifiée
     */
    async update(id: number, data: object): Promise<T> {
        const keys = Object.keys(data);
        const values = Object.values(data);

        // Construction de la clause SET: "champ1" = $1, "champ2" = $2...
        const setClause = keys
            .map((key, index) => `"${key}" = $${index + 1}`)
            .join(", ");

        const preparedQuery = {
            // L'ID vient en dernier paramètre (après toutes les valeurs)
            text: `UPDATE "${this.tableName}" SET ${setClause} WHERE id = $${
                    keys.length + 1
            } RETURNING *`,
            values: [...values, id], // Spread des valeurs + l'ID
        };
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    }

    /**
     * Supprime une entité par son ID
     * @param id Identifiant de l'entité à supprimer
     * @returns true si suppression réussie, false sinon
     */
    async delete(id: number): Promise<boolean> {
        const preparedQuery = {
            text: `DELETE FROM "${this.tableName}" WHERE id = $1`,
            values: [id],
        };
        const result = await this.client.query(preparedQuery);

        // rowCount indique le nombre de lignes affectées
        // !! convertit en boolean (0 = false, >0 = true)
        return !!result.rowCount;
    }

    /**
     * Normalise et valide les paramètres de pagination
     * Applique les valeurs par défaut et les limites configurées
     * @param pagination Paramètres optionnels de pagination
     * @returns Paramètres de pagination normalisés et validés
     */
    protected preparePaginationParams(
        pagination?: Partial<Pagination>
    ): Pagination {
        const {
            limit = config.defaultItemsPerRequest, // Valeur par défaut depuis config
            offset = 0,
            orderBy,
            direction,
        } = pagination || {};

        return {
            // Limite max pour éviter les requêtes trop lourdes
            limit: Math.min(limit, config.maxItemsPerRequest),
            // Offset minimum à 0 (pas de valeurs négatives)
            offset: Math.max(offset, 0),
            // Champ de tri par défaut si non spécifié
            orderBy: orderBy || this.defaultOrderBy,
            // Direction par défaut ASC, seule DESC est acceptée en alternative
            direction: direction?.toUpperCase() === "DESC" ? "DESC" : "ASC",
        };
    }
}

export default CoreDatamapper;