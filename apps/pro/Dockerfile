FROM node:20.10.0-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.5 --activate

# Development stage
FROM base AS development
WORKDIR /app

# Copier les fichiers de configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/pro/package.json ./apps/pro/

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le reste des fichiers
COPY . .

# Se déplacer dans le dossier pro
WORKDIR /app/apps/pro

# Démarrer l'application
CMD ["pnpm", "dev"]