-- Tables SQL pour l'API GraphQL Livres
-- Structure correspondant EXACTEMENT aux interfaces TypeScript
-- Avec relation Many-to-Many entre livre et theme via table de liaison

-- Suppression des tables existantes
DROP TABLE IF EXISTS livre_theme CASCADE;
DROP TABLE IF EXISTS livre CASCADE;
DROP TABLE IF EXISTS auteur CASCADE;
DROP TABLE IF EXISTS theme CASCADE;
DROP TABLE IF EXISTS pays CASCADE;

-- Table des pays (correspond à l'interface Pays)
CREATE TABLE pays (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    livres_id INTEGER -- Champ selon votre interface (peut rester NULL)
);

-- Table des thèmes (correspond à l'interface Theme)
CREATE TABLE theme (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    adulte BOOLEAN NOT NULL DEFAULT false,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    livres_id INTEGER -- Champ selon votre interface (peut rester NULL)
);

-- Table des auteurs (correspond à l'interface Auteur)
CREATE TABLE auteur (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    livres_id INTEGER -- Champ selon votre interface (peut rester NULL)
);

-- Table des livres (correspond EXACTEMENT à l'interface Livre)
CREATE TABLE livre (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    resume TEXT NOT NULL,
    dateParution DATE,
    dateParutionFrance DATE,
    auteur_id INTEGER NOT NULL,
    theme_id INTEGER NOT NULL,  -- ← Gardé selon votre interface
    pays_id INTEGER NOT NULL,
    nbPage INTEGER NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Contraintes de clés étrangères
    CONSTRAINT fk_livre_auteur
        FOREIGN KEY (auteur_id) REFERENCES auteur(id) ON DELETE CASCADE,
    CONSTRAINT fk_livre_theme
        FOREIGN KEY (theme_id) REFERENCES theme(id) ON DELETE CASCADE,
    CONSTRAINT fk_livre_pays
        FOREIGN KEY (pays_id) REFERENCES pays(id) ON DELETE CASCADE
);

-- ========== TABLE DE LIAISON POUR MANY-TO-MANY ==========
-- Cette table permet d'avoir plusieurs thèmes par livre
-- même si l'interface Livre garde theme_id pour le thème principal
CREATE TABLE livre_theme (
    id SERIAL PRIMARY KEY,
    livre_id INTEGER NOT NULL,
    theme_id INTEGER NOT NULL,

    -- Contraintes de clés étrangères
    CONSTRAINT fk_livre_theme_livre
        FOREIGN KEY (livre_id) REFERENCES livre(id) ON DELETE CASCADE,
    CONSTRAINT fk_livre_theme_theme
        FOREIGN KEY (theme_id) REFERENCES theme(id) ON DELETE CASCADE,

    -- Contrainte d'unicité
    CONSTRAINT uk_livre_theme UNIQUE (livre_id, theme_id)
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_livre_theme_livre ON livre_theme(livre_id);
CREATE INDEX idx_livre_theme_theme ON livre_theme(theme_id);
CREATE INDEX idx_livre_auteur ON livre(auteur_id);
CREATE INDEX idx_livre_pays ON livre(pays_id);
CREATE INDEX idx_livre_theme_main ON livre(theme_id);

-- ========== DONNÉES DE TEST ÉTENDUES ==========

-- Insertion des pays
INSERT INTO pays (nom, livres_id) VALUES
    ('France', NULL),
    ('États-Unis', NULL),
    ('Royaume-Uni', NULL),
    ('Allemagne', NULL),
    ('Japon', NULL),
    ('Espagne', NULL),
    ('Italie', NULL),
    ('Canada', NULL),
    ('Australie', NULL),
    ('Brésil', NULL),
    ('Russie', NULL),
    ('Chine', NULL);

-- Insertion des thèmes
INSERT INTO theme (titre, adulte, livres_id) VALUES
    ('Science-Fiction', false, NULL),
    ('Fantasy', false, NULL),
    ('Romance', false, NULL),
    ('Thriller', true, NULL),
    ('Horreur', true, NULL),
    ('Biographie', false, NULL),
    ('Histoire', false, NULL),
    ('Philosophie', false, NULL),
    ('Policier', false, NULL),
    ('Aventure', false, NULL),
    ('Dystopie', true, NULL),
    ('Comédie', false, NULL),
    ('Drame', false, NULL),
    ('Guerre', true, NULL),
    ('Espionnage', true, NULL),
    ('Western', false, NULL),
    ('Jeunesse', false, NULL),
    ('Classique', false, NULL),
    ('Contemporain', false, NULL),
    ('Satire', false, NULL);

-- Insertion des auteurs
INSERT INTO auteur (nom, prenom, description, livres_id) VALUES
    ('Rowling', 'J.K.', 'Auteure britannique célèbre pour la série Harry Potter', NULL),
    ('Martin', 'George R.R.', 'Écrivain américain connu pour Le Trône de Fer', NULL),
    ('Tolkien', 'J.R.R.', 'Philologue et écrivain britannique, créateur du Seigneur des Anneaux', NULL),
    ('Asimov', 'Isaac', 'Écrivain américain de science-fiction et de vulgarisation scientifique', NULL),
    ('Christie', 'Agatha', 'Romancière britannique spécialisée dans les romans policiers', NULL),
    ('King', 'Stephen', 'Écrivain américain spécialisé dans les romans d''horreur et de fantastique', NULL),
    ('Orwell', 'George', 'Écrivain et journaliste britannique', NULL),
    ('Dumas', 'Alexandre', 'Romancier français du XIXe siècle', NULL),
    ('Hugo', 'Victor', 'Écrivain français romantique du XIXe siècle', NULL),
    ('Hemingway', 'Ernest', 'Écrivain et journaliste américain, prix Nobel de littérature', NULL),
    ('Herbert', 'Frank', 'Écrivain américain de science-fiction, auteur de Dune', NULL),
    ('Card', 'Orson Scott', 'Écrivain américain de science-fiction', NULL),
    ('Bradbury', 'Ray', 'Écrivain américain de science-fiction et fantastique', NULL),
    ('Verne', 'Jules', 'Écrivain français, pionnier de la science-fiction', NULL),
    ('Doyle', 'Arthur Conan', 'Écrivain britannique, créateur de Sherlock Holmes', NULL),
    ('Shelley', 'Mary', 'Écrivaine britannique, auteure de Frankenstein', NULL),
    ('Lovecraft', 'H.P.', 'Écrivain américain d''horreur cosmique', NULL),
    ('Camus', 'Albert', 'Écrivain et philosophe français, prix Nobel de littérature', NULL),
    ('Kafka', 'Franz', 'Écrivain tchèque d''expression allemande', NULL),
    ('Dickens', 'Charles', 'Romancier britannique de l''époque victorienne', NULL);

-- Insertion des livres (avec theme_id principal selon votre interface)
INSERT INTO livre (titre, resume, dateParution, dateParutionFrance, auteur_id, theme_id, pays_id, nbPage) VALUES
    (
        'Harry Potter à l''école des sorciers',
        'L''histoire d''un jeune sorcier découvrant ses pouvoirs magiques et intégrant l''école de sorcellerie Poudlard.',
        '1997-06-26', '1998-10-09',
        1, 2, 3, 320  -- theme_id = 2 (Fantasy)
    ),
    (
        'Le Trône de Fer',
        'Une épopée fantasy dans un monde médiéval où plusieurs familles nobles se disputent le contrôle du royaume.',
        '1996-08-01', '1998-11-12',
        2, 2, 2, 694  -- theme_id = 2 (Fantasy)
    ),
    (
        'Fondation',
        'L''histoire d''un empire galactique en déclin et des efforts scientifiques pour préserver la civilisation.',
        '1951-05-01', '1957-03-15',
        4, 1, 2, 244  -- theme_id = 1 (Science-Fiction)
    ),
    (
        'Le Seigneur des Anneaux - La Communauté de l''Anneau',
        'L''aventure épique de Frodon et de ses compagnons pour détruire l''Anneau Unique.',
        '1954-07-29', '1972-11-16',
        3, 2, 3, 576  -- theme_id = 2 (Fantasy)
    ),
    (
        'Le Crime de l''Orient-Express',
        'Le célèbre détective Hercule Poirot enquête sur un meurtre mystérieux dans le train Orient-Express.',
        '1934-01-01', '1934-12-15',
        5, 9, 3, 256  -- theme_id = 9 (Policier)
    ),
    (
        'Carrie',
        'L''histoire terrifiante d''une adolescente aux pouvoirs télékinésiques qui se venge de ses bourreaux.',
        '1974-04-05', '1976-03-10',
        6, 5, 2, 304  -- theme_id = 5 (Horreur)
    ),
    (
        '1984',
        'Un roman dystopique décrivant une société totalitaire où Big Brother surveille chaque citoyen.',
        '1949-06-08', '1950-09-12',
        7, 11, 3, 368  -- theme_id = 11 (Dystopie)
    ),
    (
        'Les Trois Mousquetaires',
        'Les aventures de d''Artagnan et de ses trois amis mousquetaires au service du roi Louis XIII.',
        '1844-03-14', '1844-03-14',
        8, 10, 1, 512  -- theme_id = 10 (Aventure)
    ),
    (
        'Les Misérables',
        'L''histoire de Jean Valjean et de sa quête de rédemption dans la France du XIXe siècle.',
        '1862-03-30', '1862-03-30',
        9, 18, 1, 1488  -- theme_id = 18 (Classique)
    ),
    (
        'Pour qui sonne le glas',
        'L''histoire d''un jeune américain engagé dans la guerre civile espagnole.',
        '1940-10-21', '1948-05-15',
        10, 14, 2, 512  -- theme_id = 14 (Guerre)
    ),
    (
        'Dune',
        'L''épopée de Paul Atréides sur la planète désertique Arrakis et sa quête du pouvoir.',
        '1965-08-01', '1970-09-12',
        11, 1, 2, 688  -- theme_id = 1 (Science-Fiction)
    ),
    (
        'La Stratégie Ender',
        'Un jeune génie militaire s''entraîne pour combattre une invasion extraterrestre.',
        '1985-01-15', '1987-03-20',
        12, 1, 2, 384  -- theme_id = 1 (Science-Fiction)
    ),
    (
        'Fahrenheit 451',
        'Dans un futur où les livres sont interdits, un pompier chargé de les brûler remet en question le système.',
        '1953-10-19', '1955-12-08',
        13, 11, 2, 256  -- theme_id = 11 (Dystopie)
    ),
    (
        'Vingt mille lieues sous les mers',
        'Les aventures du professeur Aronnax à bord du Nautilus avec le mystérieux capitaine Nemo.',
        '1870-06-20', '1870-06-20',
        14, 10, 1, 448  -- theme_id = 10 (Aventure)
    ),
    (
        'Le Chien des Baskerville',
        'Sherlock Holmes enquête sur une malédiction familiale dans les landes anglaises.',
        '1902-04-01', '1903-01-15',
        15, 9, 3, 256  -- theme_id = 9 (Policier)
    ),
    (
        'Frankenstein',
        'L''histoire du scientifique Victor Frankenstein et de sa créature artificielle.',
        '1818-01-01', '1821-08-12',
        16, 5, 3, 280  -- theme_id = 5 (Horreur)
    ),
    (
        'L''Appel de Cthulhu',
        'Nouvelles d''horreur cosmique mettant en scène des entités extraterrestres anciennes.',
        '1928-02-01', '1954-10-20',
        17, 5, 2, 192  -- theme_id = 5 (Horreur)
    ),
    (
        'L''Étranger',
        'L''histoire de Meursault, un homme confronté à l''absurdité de l''existence.',
        '1942-05-19', '1942-05-19',
        18, 8, 1, 192  -- theme_id = 8 (Philosophie)
    ),
    (
        'La Métamorphose',
        'Gregor Samsa se réveille un matin transformé en insecte géant.',
        '1915-10-01', '1938-03-15',
        19, 18, 4, 96  -- theme_id = 18 (Classique)
    ),
    (
        'Harry Potter et la Chambre des secrets',
        'Harry Potter retourne à Poudlard pour sa deuxième année et découvre la Chambre des secrets.',
        '1998-07-02', '1999-03-23',
        1, 2, 3, 384  -- theme_id = 2 (Fantasy)
    ),
    (
        'Oliver Twist',
        'L''histoire d''un orphelin dans l''Angleterre industrielle du XIXe siècle.',
        '1838-02-01', '1840-05-20',
        20, 18, 3, 400  -- theme_id = 18 (Classique)
    ),
    (
        'Le Comte de Monte-Cristo',
        'L''histoire d''Edmond Dantès et de sa quête de vengeance après avoir été emprisonné injustement.',
        '1844-08-28', '1844-08-28',
        8, 10, 1, 1276  -- theme_id = 10 (Aventure)
    ),
    (
        'Notre-Dame de Paris',
        'L''histoire tragique de Quasimodo, d''Esmeralda et de Claude Frollo dans le Paris médiéval.',
        '1831-03-16', '1831-03-16',
        9, 18, 1, 512  -- theme_id = 18 (Classique)
    ),
    (
        'Le Vieil Homme et la Mer',
        'Un vieux pêcheur cubain livre un combat épique contre un espadon géant.',
        '1952-09-01', '1953-04-15',
        10, 13, 2, 127  -- theme_id = 13 (Drame)
    ),
    (
        'Shining',
        'L''histoire terrifiante de Jack Torrance qui sombre dans la folie dans un hôtel isolé.',
        '1977-01-28', '1979-05-16',
        6, 5, 2, 447  -- theme_id = 5 (Horreur)
    );

-- ========== RELATIONS MANY-TO-MANY (livre_theme) ==========

-- Harry Potter à l'école des sorciers : Fantasy, Jeunesse, Aventure
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (1, 2),   -- Fantasy
    (1, 17),  -- Jeunesse
    (1, 10);  -- Aventure

-- Le Trône de Fer : Fantasy, Drame, Guerre
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (2, 2),   -- Fantasy
    (2, 13),  -- Drame
    (2, 14);  -- Guerre

-- Fondation : Science-Fiction, Philosophie
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (3, 1),   -- Science-Fiction
    (3, 8);   -- Philosophie

-- Le Seigneur des Anneaux : Fantasy, Aventure, Classique
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (4, 2),   -- Fantasy
    (4, 10),  -- Aventure
    (4, 18);  -- Classique

-- Le Crime de l'Orient-Express : Policier, Thriller
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (5, 9),   -- Policier
    (5, 4);   -- Thriller

-- Carrie : Horreur, Thriller, Jeunesse
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (6, 5),   -- Horreur
    (6, 4),   -- Thriller
    (6, 17);  -- Jeunesse

-- 1984 : Dystopie, Science-Fiction, Philosophie
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (7, 11),  -- Dystopie
    (7, 1),   -- Science-Fiction
    (7, 8);   -- Philosophie

-- Les Trois Mousquetaires : Aventure, Histoire, Classique
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (8, 10),  -- Aventure
    (8, 7),   -- Histoire
    (8, 18);  -- Classique

-- Les Misérables : Classique, Drame, Histoire
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (9, 18),  -- Classique
    (9, 13),  -- Drame
    (9, 7);   -- Histoire

-- Pour qui sonne le glas : Guerre, Drame, Romance
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (10, 14),  -- Guerre
    (10, 13),  -- Drame
    (10, 3);   -- Romance

-- Dune : Science-Fiction, Aventure, Philosophie
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (11, 1),   -- Science-Fiction
    (11, 10),  -- Aventure
    (11, 8);   -- Philosophie

-- La Stratégie Ender : Science-Fiction, Jeunesse, Guerre
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (12, 1),   -- Science-Fiction
    (12, 17),  -- Jeunesse
    (12, 14);  -- Guerre

-- Fahrenheit 451 : Dystopie, Science-Fiction, Philosophie
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (13, 11),  -- Dystopie
    (13, 1),   -- Science-Fiction
    (13, 8);   -- Philosophie

-- Vingt mille lieues sous les mers : Aventure, Science-Fiction, Classique
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (14, 10),  -- Aventure
    (14, 1),   -- Science-Fiction
    (14, 18);  -- Classique

-- Le Chien des Baskerville : Policier, Thriller, Classique
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (15, 9),   -- Policier
    (15, 4),   -- Thriller
    (15, 18);  -- Classique

-- Frankenstein : Horreur, Science-Fiction, Classique
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (16, 5),   -- Horreur
    (16, 1),   -- Science-Fiction
    (16, 18);  -- Classique

-- L'Appel de Cthulhu : Horreur, Fantasy
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (17, 5),   -- Horreur
    (17, 2);   -- Fantasy

-- L'Étranger : Philosophie, Drame, Classique
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (18, 8),   -- Philosophie
    (18, 13),  -- Drame
    (18, 18);  -- Classique

-- La Métamorphose : Classique, Philosophie, Fantasy
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (19, 18),  -- Classique
    (19, 8),   -- Philosophie
    (19, 2);   -- Fantasy

-- Harry Potter et la Chambre des secrets : Fantasy, Jeunesse, Aventure
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (20, 2),   -- Fantasy
    (20, 17),  -- Jeunesse
    (20, 10);  -- Aventure

-- Oliver Twist : Classique, Drame, Histoire
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (21, 18),  -- Classique
    (21, 13),  -- Drame
    (21, 7);   -- Histoire

-- Le Comte de Monte-Cristo : Aventure, Drame, Histoire
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (22, 10),  -- Aventure
    (22, 13),  -- Drame
    (22, 7);   -- Histoire

-- Notre-Dame de Paris : Classique, Romance, Histoire
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (23, 18),  -- Classique
    (23, 3),   -- Romance
    (23, 7);   -- Histoire

-- Le Vieil Homme et la Mer : Drame, Aventure
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (24, 13),  -- Drame
    (24, 10);  -- Aventure

-- Shining : Horreur, Thriller
INSERT INTO livre_theme (livre_id, theme_id) VALUES
    (25, 5),   -- Horreur
    (25, 4);   -- Thriller

-- ========== REQUÊTES DE VÉRIFICATION ==========

-- Afficher tous les livres avec leur thème principal et auteur
-- SELECT
--     l.titre,
--     a.nom || ' ' || a.prenom as auteur,
--     t.titre as theme_principal,
--     p.nom as pays
-- FROM livre l
-- JOIN auteur a ON l.auteur_id = a.id
-- JOIN theme t ON l.theme_id = t.id
-- JOIN pays p ON l.pays_id = p.id
-- ORDER BY l.titre;

-- Compter les livres par thème (thème principal)
-- SELECT
--     t.titre,
--     COUNT(l.id) as nombre_livres
-- FROM theme t
-- LEFT JOIN livre l ON t.id = l.theme_id
-- GROUP BY t.id, t.titre
-- ORDER BY nombre_livres DESC, t.titre;