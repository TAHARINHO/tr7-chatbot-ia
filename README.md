# TR7 ChatBot IA

Assistant IA intelligent propulsé par Claude · TR7 Agency

## Stack

- **Next.js 16** (App Router) · TypeScript · Tailwind CSS v4
- **Shadcn/ui** (Base UI) · AI SDK v6 · Zustand · React Markdown

## Fonctionnalités

- Streaming temps réel avec Claude (Sonnet / Opus / Haiku)
- Historique des conversations persisté en localStorage
- Markdown + coloration syntaxique du code
- Design sombre premium avec thème violet TR7
- Sidebar collapsible · Sélecteur de modèle

## Démarrage local

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la clé API
cp .env.example .env.local
# Editer .env.local et ajouter ta clé Anthropic

# 3. Lancer
npm run dev
```

## Déploiement Vercel

1. Connecter ce repo sur [vercel.com/new](https://vercel.com/new)
2. Ajouter la variable d'environnement `ANTHROPIC_API_KEY`
3. Cliquer **Deploy** — URL automatique fournie

---

Made with Claude · TR7 Agency
