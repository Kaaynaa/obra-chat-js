# Obra - Plateforme de Gestion pour Artisans

![Obra](https://img.shields.io/badge/Obra-Platform-9333ea?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge)

Une plateforme de gestion complète pour artisans et entreprises. Alternative moderne, personnalisable et open-source à SuiteDash.

## ✨ Fonctionnalités

### 🔐 Authentification complète
- Inscription / Connexion sécurisée
- Gestion des rôles (Admin, Artisan, Client)
- Protection des routes et données

### 👨‍💼 Espace Admin
- Gestion complète des artisans (CRUD)
- Vue d'ensemble de la plateforme
- Statistiques en temps réel
- Interface intuitive et moderne

### 🛠️ Espace Artisan
- Gestion de clients (ajout, modification, suppression)
- Gestion de projets avec statuts
- Profil d'entreprise personnalisable
- Suivi des prospects et clients actifs

### 💬 Chat intelligent (bonus)
- Assistant IA via N8N
- Interface de chat moderne
- Barre de recherche intégrée

### 🎨 Design moderne
- Interface inspirée de SuiteDash
- Design responsive (mobile-friendly)
- Thème violet personnalisable
- Animations fluides

## 🚀 Démarrage rapide

### Prérequis
- Compte [Supabase](https://supabase.com)
- Compte [Vercel](https://vercel.com) (optionnel)
- Node.js 16+

### Installation

```bash
# Cloner le repository
git clone https://github.com/Kaaynaa/obra-chat-js.git
cd obra-chat-js

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir avec vos clés Supabase

# Lancer en développement
npm start
```

### Configuration Supabase

1. Créez un projet Supabase
2. Exécutez le script `database/schema.sql` dans l'éditeur SQL
3. Créez un utilisateur admin via Supabase Auth
4. Modifiez le rôle en "admin" dans la table profiles

📖 **[Guide d'installation complet](INSTALLATION.md)**

## 📁 Structure du projet

```
obra-chat-js/
├── api/                    # Serverless API (Vercel Functions)
│   ├── artisans.js        # Gestion des artisans
│   ├── clients.js         # Gestion des clients
│   ├── projects.js        # Gestion des projets
│   └── chat.js            # Chat avec IA
├── database/
│   └── schema.sql         # Schéma PostgreSQL complet
├── lib/
│   └── supabase.js        # Client et fonctions Supabase
├── styles/
│   └── dashboard.css      # Styles personnalisables
├── auth.html              # Authentification
├── admin.html             # Dashboard Admin
├── artisan.html           # Dashboard Artisan
└── index.html             # Page d'accueil + chat
```

## 🎯 Technologies

- **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
- **Backend** : Supabase (PostgreSQL + Auth)
- **API** : Vercel Serverless Functions
- **Hosting** : Vercel
- **IA/Chat** : N8N (optionnel)

## 🔒 Sécurité

- Row Level Security (RLS) sur toutes les tables
- Authentification JWT via Supabase
- Protection CORS configurée
- Validation des rôles côté serveur
- Données chiffrées en transit et au repos

## 🎨 Personnalisation

Le projet est 100% personnalisable :

```css
/* Modifier les couleurs dans styles/dashboard.css */
:root {
  --primary-color: #9333ea;  /* Votre couleur principale */
  --primary-light: #c084fc;
  /* ... */
}
```

## 📊 Roadmap

- [ ] Tableau de bord avec graphiques
- [ ] Système de facturation
- [ ] Calendrier et rendez-vous
- [ ] Messagerie interne
- [ ] Application mobile (React Native)
- [ ] Export PDF/Excel
- [ ] Intégration paiements (Stripe)
- [ ] Notifications push

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est open-source et libre d'utilisation.

## 💬 Support

- 📧 Email : support@obra.com
- 🐛 Issues : [GitHub Issues](https://github.com/Kaaynaa/obra-chat-js/issues)
- 📖 Documentation : [INSTALLATION.md](INSTALLATION.md)

## 🌟 Remerciements

Créé avec ❤️ pour les artisans et entrepreneurs qui veulent une solution de gestion moderne, puissante et 100% personnalisable.

---

**Déployé avec [Vercel](https://vercel.com) | Propulsé par [Supabase](https://supabase.com)**
