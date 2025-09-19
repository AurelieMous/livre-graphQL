import debug from "debug";
import { Pool } from "pg";
import { DatabaseClient } from "../../../../types";

// Configuration du logger avec le namespace "app:restodb" pour le debugging
const logger = debug("app:restodb");

// Création du pool de connexions PostgreSQL
// Le pool gère automatiquement les connexions multiples et leur réutilisation
const pool = new Pool();

// Compteur pour tracer le nombre de requêtes exécutées
let queryCount = 0;

// IIFE (Immediately Invoked Function Expression) pour initialiser la connexion
// Fonction asynchrone qui s'exécute immédiatement au chargement du module
(async function () {
    try {
        // Test de connexion à la base de données
        await pool.connect();
        logger("📚 Connected to database");
    } catch (err) {
        // En cas d'erreur de connexion, on log l'erreur mais on ne fait pas crash l'app
        logger("❌ Error connecting to database:", err);
    }
})();

// Création d'un client de base de données personnalisé qui wrap le pool PostgreSQL
const dbClient: DatabaseClient = {
    // Référence vers le pool original pour accès direct si nécessaire
    originalClient: pool,

    // Méthode query personnalisée qui ajoute du logging et du monitoring
    async query(query) {
        // Incrémentation du compteur de requêtes pour le debugging
        queryCount += 1;
        logger(`Request n° ${queryCount}`);

        // Logs commentés pour éviter d'afficher les requêtes sensibles en production
        // Utiles pour le debugging en développement
        // logger("   Query: ", query.text);
        // logger("   Values: ", query.values);

        // Exécution de la requête via le pool original
        return this.originalClient.query(query);
    },
};

// Export du client personnalisé pour utilisation dans les autres modules
export default dbClient;