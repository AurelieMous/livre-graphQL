// Import de GraphQLError pour créer des erreurs GraphQL standardisées
import { GraphQLError } from "graphql";

/**
 * Utilitaire de validation d'existence d'entité
 *
 * Cette fonction garantit qu'une entité existe et n'est pas null.
 * Si l'entité est null/undefined, elle lance une erreur GraphQL 404 standardisée.
 *
 * Pattern utilisé : Guard Clause / Assertion
 * Objectif : Centraliser la gestion des erreurs "entité non trouvée"
 *
 * @template T Type générique de l'entité à vérifier
 * @param result Le résultat à vérifier (peut être null)
 * @param entityName Nom de l'entité pour le message d'erreur (ex: "Livre", "Auteur")
 * @returns L'entité si elle existe, sinon lance une GraphQLError
 * @throws GraphQLError avec code NOT_FOUND et status HTTP 404
 */
export const ensureEntityExists = <T>(
    result: T | null,
    entityName: string
): T => {
    // Vérification de nullité - couvre null et undefined
    if (!result) {
        // Création d'une erreur GraphQL standardisée avec :
        // - Message descriptif incluant le nom de l'entité
        // - Code d'erreur standardisé pour les clients
        // - Status HTTP 404 pour les APIs REST/HTTP
        throw new GraphQLError(`${entityName} not found`, {
            extensions: {
                code: "NOT_FOUND",        // Code d'erreur pour les clients GraphQL
                http: { status: 404 },    // Status HTTP pour la compatibilité REST
            },
        });
    }

    // Si l'entité existe, on la retourne avec son type original (sans null)
    return result;
};