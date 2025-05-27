# Maroutine Santé – Monorepo

Ce dépôt contient l'ensemble des applications du projet **Maroutine Santé**, organisées dans un monorepo géré avec PNPM et Turborepo.

## 📦 Structure

```
apps/
├── admin      # Interface d'administration (Next.js)
├── pro        # Interface utilisateur "pro" (dashboard)
├── server     # Backend Hono (API REST)
```

## 🚀 Déploiement

Le déploiement est automatisé via **GitHub Actions** dès qu'un `git push` est effectué sur la branche `mrs-sb`.

### CI/CD

1. Une clé SSH privée est utilisée pour se connecter au serveur.
2. Le script :
   - Fait un `git pull`
   - Installe les dépendances
   - Build toutes les apps avec Turbo
   - Redémarre les services via `systemd`

Fichier de pipeline CI/CD : `.github/workflows/deploy.yml`

## 🔧 Services et ports

| App        | Port | Domaine                         |
|------------|------|----------------------------------|
| admin      | 3002 | https://mrs-admin.maroutinesante.fr |
| pro        | 3001 | https://dashboard.maroutinesante.fr |
| server     | 3000 | Interne (API REST)              |

## 🛠 Lancer en local

```bash
pnpm install
pnpm run dev
```

## ⚠️ Attention

Le serveur est sensible à la casse des fichiers (`Linux`).
Veille à bien respecter la casse dans tous les imports.

## 🧼 Maintenance

Pour relancer les services manuellement :

```bash
sudo systemctl restart [ mon service ] soit (mrs-server / mrs-admin / mrs-pro)
ex: sudo systemctl restart mrs-server  mrs-admin mrs-pro
```

Pour stop un services manuellement :

```bash
sudo systemctl stop [ mon service ] soit (mrs-server / mrs-admin / mrs-pro)
```

Pour start un services manuellement :

```bash
sudo systemctl start [ mon service ] soit (mrs-server / mrs-admin / mrs-pro)
```

Pour inspecter les logs :

```bash
journalctl -u [ mon service ] -f
```

---

Maintenu par l'équipe MaRoutineSanté.
