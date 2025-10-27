# 🎉 Configuration Supabase terminée !

Votre application Obra est maintenant **configurée et prête à être utilisée** !

---

## ✅ Ce qui a été fait

1. ✅ Clés Supabase configurées dans tous les fichiers HTML
2. ✅ Configuration du client Supabase (lib/supabase.js)
3. ✅ Fichier .env.local créé localement
4. ✅ Changements commitées et poussés sur GitHub

---

## 🚀 Prochaines étapes

### Étape 1 : Créer la base de données

**IMPORTANT** : Si vous ne l'avez pas encore fait, vous devez créer les tables dans Supabase :

1. Allez sur https://supabase.com et connectez-vous à votre projet
2. Cliquez sur **SQL Editor** dans le menu de gauche
3. Cliquez sur **New query**
4. Ouvrez le fichier `database/schema.sql` de votre projet
5. Copiez TOUT le contenu (CTRL+A, CTRL+C)
6. Collez dans l'éditeur SQL de Supabase
7. Cliquez sur **RUN** (bouton vert Play en bas à droite)
8. Vous devriez voir : "Success. No rows returned"

Cela va créer :
- ✅ Les tables (profiles, artisans, clients, projects)
- ✅ Les politiques de sécurité (RLS)
- ✅ Les triggers automatiques
- ✅ Les index pour les performances

---

### Étape 2 : Créer votre compte administrateur

#### Option A : Via Supabase Dashboard

1. Dans Supabase, allez dans **Authentication** → **Users**
2. Cliquez sur **Add user** → **Create new user**
3. Remplissez :
   - **Email** : admin@obra.com (ou votre email)
   - **Password** : choisissez un mot de passe fort
   - **Cochez** : Auto Confirm User
4. Cliquez sur **Create user**

5. Maintenant allez dans **Table Editor**
6. Sélectionnez la table **profiles**
7. Trouvez la ligne avec votre email
8. Double-cliquez sur la colonne **role**
9. Changez de `client` à `admin`
10. Cliquez sur la coche verte ✓ pour sauvegarder

#### Option B : Via SQL

Dans l'éditeur SQL de Supabase, exécutez :

```sql
-- Trouver votre user ID (remplacez admin@obra.com par votre email)
SELECT id FROM auth.users WHERE email = 'admin@obra.com';

-- Mettre à jour le rôle (remplacez l'UUID par celui trouvé ci-dessus)
UPDATE profiles SET role = 'admin' WHERE id = 'votre-uuid-ici';
```

---

### Étape 3 : Tester l'application

Vous avez 2 options pour tester :

#### 🌐 Option A : Déployer sur Vercel (RECOMMANDÉ)

L'application sera accessible en ligne :

```bash
# Installer Vercel CLI (si pas déjà fait)
npm install -g vercel

# Dans le dossier obra-chat-js
vercel

# Suivre les instructions
```

Lors du déploiement, Vercel va détecter automatiquement votre `.env.local`.

**URL finale** : `https://votre-projet.vercel.app`

#### 💻 Option B : Tester en local

```bash
# Cloner sur votre machine (si pas déjà fait)
git clone https://github.com/Kaaynaa/obra-chat-js.git
cd obra-chat-js
git checkout claude/code-mon-a-011CUXVSdwnMjDwt99P94Muv

# Lancer un serveur local
python -m http.server 8000
# ou
php -S localhost:8000
# ou
npx serve

# Ouvrir dans le navigateur
http://localhost:8000/auth.html
```

---

### Étape 4 : Se connecter et tester

1. Allez sur `/auth.html`
2. Connectez-vous avec votre compte admin
3. Vous serez redirigé vers `/admin.html`
4. Testez les fonctionnalités :
   - ✅ Créer un artisan
   - ✅ Modifier un artisan
   - ✅ Voir les statistiques

5. Créez un compte artisan pour tester `/artisan.html`

---

## 📋 Pages disponibles

Une fois connecté, vous pouvez accéder à :

- `/auth.html` - Connexion / Inscription
- `/admin.html` - Dashboard Admin (gérer les artisans)
- `/artisan.html` - Dashboard Artisan (gérer clients & projets)
- `/index.html` - Page d'accueil avec chat

---

## 🔧 Dépannage

### Problème : "Invalid API key"
→ Vérifiez que les clés Supabase sont correctement copiées

### Problème : "relation profiles does not exist"
→ Vous n'avez pas exécuté le script SQL `database/schema.sql`

### Problème : Pas de redirection après connexion
→ Vérifiez la console du navigateur (F12) pour voir les erreurs
→ Vérifiez que le rôle est bien défini dans la table profiles

### Problème : Erreur "User not found"
→ Le compte n'existe pas, créez-le via Supabase Auth

### Problème : "Access denied"
→ Le rôle n'est pas correctement configuré (doit être "admin" ou "artisan")

---

## 🎯 Architecture de l'application

```
Obra
├── Frontend (HTML/CSS/JS)
│   ├── auth.html (authentification)
│   ├── admin.html (dashboard admin)
│   └── artisan.html (dashboard artisan)
│
├── Backend (Supabase)
│   ├── PostgreSQL (base de données)
│   ├── Auth (authentification JWT)
│   └── Row Level Security (RLS)
│
└── API (Vercel Functions)
    ├── /api/artisans
    ├── /api/clients
    └── /api/projects
```

---

## 🎨 Personnalisation

Pour changer les couleurs, modifiez `styles/dashboard.css` :

```css
:root {
  --primary-color: #9333ea;  /* Votre couleur */
  --primary-light: #c084fc;
  /* etc. */
}
```

---

## 📧 Support

Si vous rencontrez des problèmes :

1. Vérifiez la console du navigateur (F12)
2. Vérifiez les logs dans Supabase (Logs → Auth / Database)
3. Consultez `INSTALLATION.md` pour plus de détails
4. Ouvrez une issue sur GitHub

---

## 🎉 Bravo !

Vous avez maintenant une plateforme de gestion complète pour artisans, entièrement personnalisable et prête à l'emploi !

**Prochaines améliorations possibles** :
- 📊 Tableaux de bord avec graphiques
- 📄 Système de facturation
- 📅 Calendrier et rendez-vous
- 💬 Messagerie interne
- 📱 Application mobile
- 💳 Intégration paiements

---

**Fait avec ❤️ - Obra Platform**
