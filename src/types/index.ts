export interface Livre {
    id: number;
    titre: string;
    resume: string;
    dateParution: Date;
    dateParutionFrance: Date;
    auteur_id: number;
    theme_id: number;
    pays_id: number;
    nbPage: number;
    createdAt: Date;
}

export interface Auteur {
    id: number;
    nom: string;
    prenom: string;
    description: string;
    createdAt: Date;
}

export interface Theme {
    id: number;
    titre: string;
    adulte: boolean;
    createdAt: Date;
}

export interface Pays {
    id: number;
    nom: string;
    createdAt: Date;
}
