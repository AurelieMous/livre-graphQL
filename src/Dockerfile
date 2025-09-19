FROM node:22-alpine

# Installer ts-node globalement pour exécuter TypeScript directement
RUN npm install -g ts-node nodemon

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port
EXPOSE 3000

# Commande de développement
CMD ["npm", "run", "dev"]