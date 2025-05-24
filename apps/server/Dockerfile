FROM node:18-slim

# Installer netcat et pnpm
RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/* && \
  npm install -g pnpm

WORKDIR /app

# Copier uniquement les fichiers nécessaires pour l'installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier uniquement le code source du serveur
COPY apps/server/src ./apps/server/src
COPY apps/server/tsconfig.json ./apps/server/

# Se déplacer dans le dossier server
WORKDIR /app/apps/server

# Exposer le port
EXPOSE 3000
CMD ["pnpm", "run", "dev"] 