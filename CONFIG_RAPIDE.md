# Configuration Rapide Obra

## Étape 1 : Créer un projet Supabase

1. Allez sur https://supabase.com
2. Cliquez sur "New Project"
3. Remplissez :
   - **Name** : Obra
   - **Database Password** : (notez-le bien !)
   - **Region** : Choisissez la plus proche
4. Attendez 2 minutes que le projet se crée

## Étape 2 : Récupérer les clés

1. Dans votre projet Supabase, allez dans **Settings** (icône engrenage)
2. Cliquez sur **API**
3. Copiez :
   - **Project URL** : `https://xxxxxx.supabase.co`
   - **Anon key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Étape 3 : Créer la base de données

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur **New query**
3. Copiez TOUT le contenu du fichier `database/schema.sql`
4. Collez dans l'éditeur SQL
5. Cliquez sur **RUN** (bouton vert en bas à droite)
6. Vous devriez voir "Success. No rows returned"

## Étape 4 : Configurer les fichiers HTML

Vous devez modifier **3 fichiers** :

### 1. auth.html (ligne 88)
```javascript
// REMPLACER CES LIGNES :
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

// PAR VOS VRAIES VALEURS :
const supabaseUrl = 'https://xxxxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 2. admin.html (ligne 157)
```javascript
// Même chose - remplacer les placeholders
const supabaseUrl = 'https://xxxxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 3. artisan.html (ligne 314)
```javascript
// Même chose - remplacer les placeholders
const supabaseUrl = 'https://xxxxxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## Étape 5 : Créer un compte admin

### Méthode A : Via Supabase Dashboard (FACILE)

1. Dans Supabase, allez dans **Authentication** > **Users**
2. Cliquez sur **Add user** > **Create new user**
3. Remplissez :
   - **Email** : admin@obra.com (ou votre email)
   - **Password** : votre_mot_de_passe_fort
   - Cochez **Auto Confirm User**
4. Cliquez sur **Create user**

5. Maintenant, allez dans **Table Editor**
6. Sélectionnez la table **profiles**
7. Trouvez la ligne avec votre email
8. Double-cliquez sur la colonne **role**
9. Changez de `client` à `admin`
10. Cliquez sur la coche verte pour sauvegarder

### Méthode B : Via votre interface (après avoir ouvert auth.html)

1. Ouvrez `auth.html` dans votre navigateur
2. Créez un compte normal
3. Puis suivez l'étape 5-6 ci-dessus pour changer le rôle en admin

## Étape 6 : Tester l'application

### Si vous testez en local :
```bash
# Dans le dossier obra-chat-js
python -m http.server 8000
# ou
php -S localhost:8000
```

Puis ouvrez :
- http://localhost:8000/auth.html

### Si vous déployez sur Vercel :
```bash
vercel
```

Puis ajoutez les variables d'environnement dans Vercel :
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Étape 7 : Se connecter

1. Allez sur `/auth.html`
2. Connectez-vous avec admin@obra.com
3. Vous serez redirigé vers `/admin.html`
4. Vous pouvez maintenant gérer les artisans !

## 🎉 C'est prêt !

Vous avez maintenant :
- ✅ Un espace admin pour gérer les artisans
- ✅ Un espace artisan pour gérer clients et projets
- ✅ Une authentification sécurisée
- ✅ Une base de données PostgreSQL

## 🆘 En cas de problème

### Erreur : "Invalid API key"
→ Vérifiez que vous avez bien copié la clé complète depuis Supabase

### Erreur : "relation profiles does not exist"
→ Vous n'avez pas exécuté le script SQL dans Supabase

### Je ne suis pas redirigé après connexion
→ Vérifiez la console du navigateur (F12) pour voir les erreurs

### Rien ne s'affiche
→ Ouvrez la console (F12) et regardez les erreurs réseau

---

**Besoin d'aide ? Contactez-moi !**
