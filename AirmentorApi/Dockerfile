# Utiliser une image Node.js comme base
FROM node:20.10

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Compiler les fichiers TypeScript (si nécessaire) ou utiliser `tsx` pour exécution directe
RUN npx tsc || echo "TypeScript build skipped"

# Exposer le port sur lequel l'API écoute (par défaut : 3000, à ajuster si nécessaire)
EXPOSE 3000

# Commande pour démarrer l'application en mode développement
CMD ["npm", "run", "dev"]
