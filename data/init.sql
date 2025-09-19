-- Tables SQL pour l'API GraphQL Livres
-- Structure correspondant exactement aux interfaces TypeScript
-- Avec données de test incluses

-- Table des pays
CREATE TABLE pays (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des thèmes
CREATE TABLE theme (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    adulte BOOLEAN NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des auteurs
CREATE TABLE auteur (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des livres
CREATE TABLE livre (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    resume TEXT NOT NULL,
    dateParution DATE,
    dateParutionFrance DATE,
    auteur_id INTEGER NOT NULL,
    theme_id INTEGER NOT NULL,
    pays_id INTEGER NOT NULL,
    nbPage INTEGER NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Contraintes de clés étrangères
    CONSTRAINT fk_livre_auteur
        FOREIGN KEY (auteur_id) REFERENCES auteur(id),
    CONSTRAINT fk_livre_theme
        FOREIGN KEY (theme_id) REFERENCES theme(id),
    CONSTRAINT fk_livre_pays
        FOREIGN KEY (pays_id) REFERENCES pays(id)
);

-- Données de test

INSERT INTO pays (nom) VALUES
    ('France'),
    ('États-Unis'),
    ('Royaume-Uni'),
    ('Allemagne'),
    ('Japon'),
    ('Espagne'),
    ('Italie');

INSERT INTO theme (titre, adulte) VALUES
    ('Science-Fiction', false),
    ('Fantasy', false),
    ('Romance', false),
    ('Thriller', true),
    ('Horreur', true),
    ('Biographie', false),
    ('Histoire', false),
    ('Philosophie', false),
    ('Policier', false),
    ('Aventure', false);

INSERT INTO auteur (nom, prenom, description) VALUES
    ('Rowling', 'J.K.', 'Auteure britannique célèbre pour la série Harry Potter'),
    ('Martin', 'George R.R.', 'Écrivain américain connu pour Le Trône de Fer'),
    ('Tolkien', 'J.R.R.', 'Philologue et écrivain britannique, créateur du Seigneur des Anneaux'),
    ('Asimov', 'Isaac', 'Écrivain américain de science-fiction et de vulgarisation scientifique'),
    ('Christie', 'Agatha', 'Romancière britannique spécialisée dans les romans policiers'),
    ('King', 'Stephen', 'Écrivain américain spécialisé dans les romans d''horreur et de fantastique'),
    ('Orwell', 'George', 'Écrivain et journaliste britannique'),
    ('Dumas', 'Alexandre', 'Romancier français du XIXe siècle');

INSERT INTO livre (titre, resume, dateParution, dateParutionFrance, auteur_id, theme_id, pays_id, nbPage) VALUES
    (
        'Harry Potter à l école des sorciers',
        'L histoire d un jeune sorcier découvrant ses pouvoirs magiques et intégrant l école de sorcellerie Poudlard.',
        '1997-06-26',
        '1998-10-09',
        1, -- J.K. Rowling
        2, -- Fantasy
        3, -- Royaume-Uni
        320
    ),
    (
        'Le Trône de Fer',
        'Une épopée fantasy dans un monde médiéval où plusieurs familles nobles se disputent le contrôle du royaume.',
        '1996-08-01',
        '1998-11-12',
        2, -- George R.R. Martin
        2, -- Fantasy
        2, -- États-Unis
        694
    ),
    (
        'Fondation',
        'L histoire d un empire galactique en déclin et des efforts scientifiques pour préserver la civilisation.',
        '1951-05-01',
        '1957-03-15',
        4, -- Isaac Asimov
        1, -- Science-Fiction
        2, -- États-Unis
        244
    ),
    (
        'Le Seigneur des Anneaux - La Communauté de l Anneau',
        'L aventure épique de Frodon et de ses compagnons pour détruire l Anneau Unique.',
        '1954-07-29',
        '1972-11-16',
        3, -- J.R.R. Tolkien
        2, -- Fantasy
        3, -- Royaume-Uni
        576
    ),
    (
        'Le Crime de l Orient-Express',
        'Le célèbre détective Hercule Poirot enquête sur un meurtre mystérieux dans le train Orient-Express.',
        '1934-01-01',
        '1934-12-15',
        5, -- Agatha Christie
        9, -- Policier
        3, -- Royaume-Uni
        256
    ),
    (
        'Carrie',
        'L histoire terrifiante d une adolescente aux pouvoirs télékinésiques qui se venge de ses bourreaux.',
        '1974-04-05',
        '1976-03-10',
        6, -- Stephen King
        5, -- Horreur
        2, -- États-Unis
        304
    ),
    (
        '1984',
        'Un roman dystopique décrivant une société totalitaire où Big Brother surveille chaque citoyen.',
        '1949-06-08',
        '1950-09-12',
        7, -- George Orwell
        1, -- Science-Fiction
        3, -- Royaume-Uni
        368
    ),
    (
        'Les Trois Mousquetaires',
        'Les aventures de d Artagnan et de ses trois amis mousquetaires au service du roi Louis XIII.',
        '1844-03-14',
        '1844-03-14',
        8, -- Alexandre Dumas
        10, -- Aventure
        1, -- France
        512
    );