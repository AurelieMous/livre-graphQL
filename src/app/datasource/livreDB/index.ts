// Import du type de configuration pour la base de données
import {LivreDBConfig} from "../../../types";
// Import du client PostgreSQL configuré (pool de connexions)
import client from "./db/pg";
import Livre from "./livre";
import Auteur from "./auteur";
import Theme from "./theme";
import Pays from "./pays";

/**
 * Classe LivreDB - Pattern Facade/Repository Factory
 *
 * Cette classe centralise l'accès à toutes les entités de la base de données.
 * Elle fournit une interface unifiée pour interagir avec les différentes tables
 * (livres, auteurs, thèmes, pays) via leurs datamappers respectifs.
 *
 * Pattern utilisé : Facade Pattern - simplifie l'accès aux sous-systèmes complexes
 */
class LivreDB{
    // Datamapper pour la gestion des livres
    livre;
    // Datamapper pour la gestion des auteurs
    auteur;
    // Datamapper pour la gestion des thèmes
    theme;
    // Datamapper pour la gestion des pays
    pays;

    /**
     * Constructeur - Initialise tous les datamappers avec la même configuration
     *
     * @param options Configuration optionnelle pour surcharger les paramètres par défaut
     *                Si non fournie, utilise le client PostgreSQL par défaut
     */
    constructor(options : LivreDBConfig) {
        // Instanciation de tous les datamappers avec la configuration finale
        // Chaque datamapper hérite de CoreDatamapper et implémente ses spécificités
        this.livre = new Livre(options);
        this.auteur = new Auteur(options);
        this.theme = new Theme(options);
        this.pays = new Pays(options);
    }
}

export default LivreDB;