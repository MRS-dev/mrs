FROM node:20.10.0-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.5 --activate

# Development stage
FROM base AS development
WORKDIR /app

# Copier les fichiers de configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin/package.json ./apps/admin/

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Copier le reste des fichiers
COPY . .

# Se déplacer dans le dossier admin
WORKDIR /app/apps/admin

# Démarrer l'application
CMD ["pnpm", "dev"]

# Production stage
FROM base AS production
WORKDIR /app

# Copier les fichiers de configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin/package.json ./apps/admin/

# Installer les dépendances de production
RUN pnpm install --frozen-lockfile --prod

# Copier le reste des fichiers
COPY . .

# Se déplacer dans le dossier pro
WORKDIR /app/apps/admin

# Build et démarrer l'application
RUN pnpm build
CMD ["pnpm", "start"] 