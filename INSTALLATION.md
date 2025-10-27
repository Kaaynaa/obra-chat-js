# Installation Obra - Guide Complet

## Vue d'ensemble

Obra est une plateforme de gestion complète pour artisans et entreprises, similaire à SuiteDash mais 100% personnalisable.

### Fonctionnalités

- **Espace Admin** : Gestion complète des artisans (CRUD)
- **Espace Artisan** : Gestion des clients et projets
- **Authentification** : Système complet avec Supabase Auth
- **Base de données** : PostgreSQL via Supabase
- **Design moderne** : Interface inspirée de SuiteDash
- **100% Personnalisable** : Code source complet disponible

## Prérequis

- Un compte [Supabase](https://supabase.com)
- Un compte [Vercel](https://vercel.com) (pour le déploiement)
- Node.js 16+ (pour le développement local)

## Étape 1 : Configuration Supabase

### 1.1 Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre `Project URL` et `Anon Key`

### 1.2 Configurer la base de données

1. Allez dans l'éditeur SQL de Supabase
2. Copiez le contenu de `database/schema.sql`
3. Exécutez le script SQL pour créer toutes les tables

Le schéma créera :
- `profiles` - Profils utilisateurs
- `artisans` - Informations artisans
- `clients` - Clients des artisans
- `projects` - Projets entre artisans et clients

### 1.3 Configurer l'authentification

1. Allez dans Authentication > Settings
2. Activez "Email" comme provider
3. Désactivez "Confirm email" pour les tests (optionnel)

### 1.4 Créer un compte admin

1. Allez dans Authentication > Users
2. Cliquez sur "Add user"
3. Créez un utilisateur avec :
   - Email: admin@obra.com
   - Password: (votre mot de passe)
4. Allez dans Table Editor > profiles
5. Modifiez le profil de cet utilisateur et changez `role` en `admin`

## Étape 2 : Configuration du projet

### 2.1 Cloner le projet

```bash
git clone https://github.com/Kaaynaa/obra-chat-js.git
cd obra-chat-js
```

### 2.2 Installer les dépendances

```bash
npm install
```

### 2.3 Configurer les variables d'environnement

1. Copiez `.env.example` vers `.env.local`
2. Remplissez les valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2.4 Mettre à jour les fichiers HTML

Les fichiers `auth.html`, `admin.html`, et `artisan.html` contiennent des placeholders pour la configuration Supabase. Remplacez :

```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

Par vos vraies valeurs Supabase.

**Note**: Pour une meilleure sécurité en production, utilisez un système de variables d'environnement ou un bundler qui injecte ces valeurs automatiquement.

## Étape 3 : Développement local

```bash
npm start
# ou
vercel dev
```

L'application sera accessible sur `http://localhost:3000`

## Étape 4 : Déploiement sur Vercel

### 4.1 Via CLI

```bash
npm i -g vercel
vercel
```

### 4.2 Via l'interface web

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "New Project"
3. Importez votre repository GitHub
4. Ajoutez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Déployez

### 4.3 Configuration du domaine personnalisé

1. Allez dans Settings > Domains
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions

## Structure de l'application

```
obra-chat-js/
├── api/                    # API Endpoints Vercel
│   ├── artisans.js        # CRUD Artisans
│   ├── clients.js         # CRUD Clients
│   ├── projects.js        # CRUD Projets
│   └── chat.js            # Chat avec N8N
├── database/
│   └── schema.sql         # Schéma de base de données
├── lib/
│   └── supabase.js        # Client Supabase + fonctions auth
├── styles/
│   └── dashboard.css      # Styles des dashboards
├── auth.html              # Page de connexion/inscription
├── admin.html             # Dashboard Admin
├── artisan.html           # Dashboard Artisan
└── index.html             # Page d'accueil

```

## Pages disponibles

- `/` - Page d'accueil (avec chat Obra)
- `/auth.html` - Connexion / Inscription
- `/admin.html` - Dashboard Admin (gérer les artisans)
- `/artisan.html` - Dashboard Artisan (gérer clients et projets)

## Rôles et permissions

### Admin
- Voir tous les artisans
- Créer/Modifier/Supprimer des artisans
- Voir toutes les données de la plateforme

### Artisan
- Gérer ses propres clients
- Créer et gérer des projets
- Modifier les informations de son entreprise

### Client (futur)
- Voir ses projets
- Communiquer avec son artisan

## Personnalisation

### Couleurs

Modifiez les variables CSS dans `styles/dashboard.css` :

```css
:root {
  --primary-color: #9333ea;        /* Violet */
  --primary-light: #c084fc;
  --primary-dark: #7e22ce;
  --secondary-color: #667eea;
  /* ... */
}
```

### Logo et nom

Modifiez le nom "Obra" dans les fichiers HTML selon vos besoins.

### Fonctionnalités supplémentaires

Le code est entièrement personnalisable. Vous pouvez :
- Ajouter de nouveaux rôles
- Créer de nouvelles tables
- Ajouter des fonctionnalités (facturation, calendrier, etc.)
- Intégrer des services externes

## Sécurité

### Row Level Security (RLS)

Le schéma SQL inclut des politiques RLS qui garantissent :
- Les artisans voient uniquement leurs clients
- Les admins ont accès complet
- Les utilisateurs ne peuvent modifier que leurs propres données

### Bonnes pratiques

1. **Ne jamais commiter** les fichiers `.env` ou les clés API
2. Utilisez des **mots de passe forts** pour les comptes admin
3. Activez l'**authentification à deux facteurs** sur Supabase
4. En production, activez la **confirmation par email**
5. Surveillez les **logs d'authentification** dans Supabase

## API Endpoints

Tous les endpoints nécessitent une authentification via Bearer token.

### Artisans
- `GET /api/artisans` - Liste tous les artisans (admin)
- `GET /api/artisans?id=xxx` - Obtenir un artisan
- `POST /api/artisans` - Créer un artisan (admin)
- `PUT /api/artisans?id=xxx` - Modifier un artisan (admin)
- `DELETE /api/artisans?id=xxx` - Supprimer un artisan (admin)

### Clients
- `GET /api/clients` - Liste les clients (artisan voit les siens)
- `GET /api/clients?id=xxx` - Obtenir un client
- `POST /api/clients` - Créer un client
- `PUT /api/clients?id=xxx` - Modifier un client
- `DELETE /api/clients?id=xxx` - Supprimer un client

### Projets
- `GET /api/projects` - Liste les projets
- `GET /api/projects?id=xxx` - Obtenir un projet
- `POST /api/projects` - Créer un projet
- `PUT /api/projects?id=xxx` - Modifier un projet
- `DELETE /api/projects?id=xxx` - Supprimer un projet

## Support et contribution

- **Issues** : [GitHub Issues](https://github.com/Kaaynaa/obra-chat-js/issues)
- **Documentation** : Ce fichier et les commentaires dans le code
- **Communauté** : Créez des discussions dans GitHub

## Licence

Ce projet est libre d'utilisation et de modification selon vos besoins.

---

**Fait avec ❤️ pour les artisans et entrepreneurs**
