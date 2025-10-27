# 🤖 Agent IA WhatsApp avec n8n

Guide complet pour déployer un agent IA WhatsApp professionnel avec n8n.

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Workflows disponibles](#workflows-disponibles)
6. [Schéma de base de données](#schéma-de-base-de-données)
7. [Déploiement](#déploiement)
8. [Utilisation](#utilisation)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Vue d'ensemble

Ce projet fournit **3 workflows n8n** pour créer un agent IA WhatsApp :

### 1. **Basic** - Agent IA simple
- ✅ Reçoit messages WhatsApp
- ✅ Répond avec OpenAI GPT-4
- ✅ Sauvegarde optionnelle en BDD

### 2. **Advanced** - Avec mémoire conversationnelle
- ✅ Historique de conversation (5 derniers messages)
- ✅ Claude 3.5 Sonnet
- ✅ Détection d'intention
- ✅ Alertes Slack pour urgences
- ✅ Contexte client automatique

### 3. **Business Functions** - Avec actions métier
- ✅ **Function calling** (Claude)
- ✅ Créer des devis automatiquement
- ✅ Prendre des rendez-vous
- ✅ Enregistrer nouveaux clients
- ✅ Chercher disponibilités
- ✅ CRM intégré

---

## 🛠️ Prérequis

### Services requis

| Service | Version | Prix | Lien |
|---------|---------|------|------|
| **n8n** | ≥ 1.0 | Gratuit (self-hosted) | [n8n.io](https://n8n.io) |
| **Twilio** | - | Pay-as-you-go | [twilio.com](https://twilio.com) |
| **OpenAI** ou **Anthropic** | - | API | [openai.com](https://openai.com) / [anthropic.com](https://anthropic.com) |
| **PostgreSQL** | ≥ 14 | Gratuit | [supabase.com](https://supabase.com) (recommandé) |

### Optionnel
- **Slack** (pour notifications d'urgence)
- **Google Calendar** (pour sync RDV)

---

## 📦 Installation

### 1. Installer n8n

#### Option A: Docker (Recommandé)

```bash
# Créer un docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=changeme123
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - N8N_SECURE_COOKIE=false
      - WEBHOOK_URL=https://votre-domaine.com
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
EOF

# Démarrer n8n
docker-compose up -d

# Vérifier
docker logs -f n8n
```

#### Option B: npm

```bash
npm install n8n -g
n8n start
```

### 2. Créer la base de données

#### Avec Supabase (Gratuit)

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Dans **SQL Editor**, copiez-collez le contenu de `database-schema.sql`
4. Exécutez le script

#### Avec PostgreSQL local

```bash
# Connexion à PostgreSQL
psql -U postgres

# Créer la base
CREATE DATABASE obra_whatsapp;
\c obra_whatsapp

# Importer le schéma
\i database-schema.sql
```

### 3. Configurer Twilio WhatsApp

1. Créez un compte [Twilio](https://www.twilio.com/try-twilio)
2. Allez dans **Messaging** → **Try WhatsApp**
3. Activez le **Twilio Sandbox for WhatsApp**
4. Notez votre **numéro WhatsApp** (format: `whatsapp:+14155238886`)
5. Récupérez :
   - **Account SID**
   - **Auth Token**

---

## ⚙️ Configuration

### 1. Importer les workflows dans n8n

1. Ouvrez n8n (`http://localhost:5678`)
2. Cliquez sur **"+"** → **Import from File**
3. Importez les fichiers JSON :
   - `1-basic-whatsapp-ai-agent.json`
   - `2-advanced-whatsapp-ai-memory.json`
   - `3-business-functions-whatsapp-ai.json`

### 2. Configurer les credentials

#### A. Twilio (pour WhatsApp)

1. Dans n8n, allez dans **Settings** → **Credentials**
2. Créez **HTTP Basic Auth** :
   - **Name**: `Twilio Credentials`
   - **Username**: `<votre Account SID>`
   - **Password**: `<votre Auth Token>`

#### B. OpenAI

1. Créez une clé API sur [platform.openai.com](https://platform.openai.com/api-keys)
2. Dans n8n, créez **OpenAI API** :
   - **API Key**: `sk-...`

#### C. Anthropic (Claude)

1. Créez une clé API sur [console.anthropic.com](https://console.anthropic.com)
2. Dans n8n, créez **Anthropic API** :
   - **API Key**: `sk-ant-...`

#### D. PostgreSQL

1. Dans n8n, créez **Postgres** :
   - **Host**: `db.xxx.supabase.co` (ou `localhost`)
   - **Database**: `obra_whatsapp`
   - **User**: `postgres`
   - **Password**: `<votre mot de passe>`
   - **Port**: `5432`
   - **SSL**: `allow` (pour Supabase)

### 3. Configurer les variables d'environnement

#### Dans Docker (docker-compose.yml)

```yaml
environment:
  - TWILIO_ACCOUNT_SID=AC...
  - TWILIO_WHATSAPP_NUMBER=+14155238886
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

#### En local (.env)

```bash
# Créer un fichier .env
cat > .env << 'EOF'
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=+14155238886
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
EOF

# Charger les variables
export $(cat .env | xargs)
```

### 4. Activer le webhook dans Twilio

1. Allez dans [Twilio Console](https://console.twilio.com)
2. **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Dans **Sandbox settings** :
   - **When a message comes in**: `https://votre-domaine.com/webhook/whatsapp-webhook`
   - **HTTP Method**: `POST`

**URL du webhook** = L'URL du node **Webhook** dans n8n

---

## 🎨 Workflows disponibles

### Workflow 1: Basic

**Fichier**: `1-basic-whatsapp-ai-agent.json`

**Nodes**:
```
Webhook WhatsApp
   ↓
Extract Message
   ↓
OpenAI Chat (GPT-4)
   ↓
Send WhatsApp Reply
   ↓
Respond to Webhook
```

**Utilisation**: Idéal pour démarrer rapidement.

---

### Workflow 2: Advanced (Mémoire)

**Fichier**: `2-advanced-whatsapp-ai-memory.json`

**Nodes**:
```
Webhook WhatsApp
   ↓
Extract Message → Detect Intent
   ↓              ↓
Get History     Check Urgency → Notify Team (Slack)
   ↓
Build Context
   ↓
Claude AI
   ↓
Extract Response
   ↓
Send WhatsApp + Save Conversation
   ↓
Respond to Webhook
```

**Fonctionnalités**:
- Garde en mémoire les 5 derniers messages
- Détecte l'intention (devis, RDV, urgence, etc.)
- Alerte l'équipe sur Slack si urgence
- Stocke tout dans PostgreSQL

---

### Workflow 3: Business Functions

**Fichier**: `3-business-functions-whatsapp-ai.json`

**Nodes**:
```
Webhook WhatsApp
   ↓
Extract Message
   ↓
Get Client Info (CRM)
   ↓
Claude with Function Calling
   ↓
Analyze Response → Needs Function?
                      ↓ OUI          ↓ NON
                   Route Function    |
                      ↓               |
         ┌────────────┼────────────┐  |
         ↓            ↓            ↓  |
    Create Devis  Create RDV  Create Client
         ↓            ↓            ↓  |
         └────────────┴────────────┘  |
                      ↓                ↓
              Format Function Result  |
                      ↓                |
                 Build Final Message←─┘
                      ↓
                 Send WhatsApp
                      ↓
              Respond to Webhook
```

**Fonctions disponibles**:

| Fonction | Description | Exemple |
|----------|-------------|---------|
| `creer_devis` | Créer un devis | "J'ai besoin d'un devis pour une installation" |
| `prendre_rdv` | Prendre un RDV | "Je voudrais un rendez-vous demain" |
| `chercher_disponibilites` | Voir les dispos | "Quand êtes-vous disponible ?" |
| `enregistrer_client` | Nouveau client | "Je m'appelle Paul Martin" |
| `verifier_statut_projet` | Suivi projet | "Où en est mon devis #123 ?" |

---

## 💾 Schéma de base de données

### Tables principales

```sql
whatsapp_conversations  -- Tous les messages
clients                 -- CRM clients
devis                   -- Gestion devis
rendez_vous            -- Planning RDV
agenda                 -- Disponibilités
projets                -- Suivi projets
factures               -- Facturation
```

### Exemple de requêtes

```sql
-- Voir les conversations récentes
SELECT * FROM whatsapp_conversations
ORDER BY timestamp DESC LIMIT 10;

-- Devis en attente
SELECT * FROM v_devis_pending;

-- RDV à confirmer
SELECT * FROM v_rdv_to_confirm;

-- Stats clients par source
SELECT * FROM v_clients_by_source;
```

---

## 🚀 Déploiement

### Option 1: Railway.app (Gratuit)

```bash
# 1. Installer Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Créer projet
railway init

# 4. Ajouter PostgreSQL
railway add

# 5. Déployer n8n
railway up
```

### Option 2: Render.com

1. Créez un compte sur [render.com](https://render.com)
2. **New** → **Web Service**
3. Docker image: `n8nio/n8n:latest`
4. Ajoutez les variables d'environnement
5. Déployez !

### Option 3: VPS (DigitalOcean, Hetzner, etc.)

```bash
# Installation complète sur Ubuntu 22.04
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Cloner le repo
git clone https://github.com/votre-repo/obra-whatsapp-ai
cd obra-whatsapp-ai

# Lancer
docker-compose up -d
```

### Configurer HTTPS (Obligatoire pour webhooks)

```bash
# Avec Caddy (le plus simple)
sudo apt install caddy

# Créer Caddyfile
cat > /etc/caddy/Caddyfile << 'EOF'
n8n.votre-domaine.com {
    reverse_proxy localhost:5678
}
EOF

# Redémarrer Caddy
sudo systemctl restart caddy
```

---

## 📱 Utilisation

### Tester le workflow

1. **Activez le workflow** dans n8n
2. Envoyez un message WhatsApp au numéro Twilio :
   ```
   "Bonjour, je voudrais un devis pour une installation"
   ```
3. L'IA devrait répondre automatiquement !

### Exemples de conversations

#### Demande de devis
```
👤 Client: "J'ai besoin d'un devis pour refaire toute ma plomberie"

🤖 Obra: "Je comprends ! Je vais créer un devis pour une rénovation
        plomberie complète.

        ✅ Devis créé avec succès ! Numéro: 47
        Vous recevrez le devis détaillé sous 24h."
```

#### Prise de RDV
```
👤 Client: "Quand êtes-vous disponible cette semaine ?"

🤖 Obra: "Voici mes disponibilités cette semaine :

        • Mercredi 17/01 à 09:00
        • Mercredi 17/01 à 14:00
        • Jeudi 18/01 à 10:00

        Quelle heure vous convient le mieux ?"
```

#### Urgence
```
👤 Client: "URGENT ! J'ai une fuite d'eau importante !"

🤖 Obra: "Je comprends l'urgence ! Un technicien va vous contacter
        dans les 15 minutes pour une intervention d'urgence.

        ✅ Intervention d'urgence enregistrée !"

[+ Notification Slack envoyée à l'équipe]
```

---

## 🔧 Troubleshooting

### Problème: Le webhook ne fonctionne pas

**Vérifications**:
1. L'URL du webhook est bien HTTPS
2. Le workflow est activé (toggle bleu)
3. L'URL dans Twilio est correcte
4. Testez l'URL avec curl :
   ```bash
   curl -X POST https://votre-domaine.com/webhook/whatsapp-webhook \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "From=whatsapp:+33612345678&Body=Test"
   ```

### Problème: L'IA ne répond pas

**Vérifications**:
1. La clé API OpenAI/Anthropic est valide
2. Vous avez des crédits sur votre compte API
3. Regardez les logs n8n :
   ```bash
   docker logs -f n8n
   ```

### Problème: Erreur de connexion à la BDD

**Vérifications**:
1. Les credentials PostgreSQL sont corrects
2. Le serveur PostgreSQL est accessible
3. Test de connexion :
   ```bash
   psql -h db.xxx.supabase.co -U postgres -d obra_whatsapp
   ```

### Problème: Function calling ne marche pas

**Cause probable**: Claude doit être en version 3.5 Sonnet ou supérieur.

**Solution**:
1. Vérifiez le modèle dans le workflow :
   ```json
   "model": "claude-3-5-sonnet-20241022"
   ```

---

## 📊 Monitoring

### Dashboard Supabase

1. Allez sur votre projet Supabase
2. **Table Editor** → Voir les données en temps réel
3. **Logs** → Voir les requêtes SQL

### Logs n8n

```bash
# En temps réel
docker logs -f n8n

# Dernières 100 lignes
docker logs --tail 100 n8n
```

### Metrics Twilio

1. [Twilio Console](https://console.twilio.com)
2. **Monitor** → **Logs** → **Messaging**
3. Voir tous les messages WhatsApp

---

## 🎓 Ressources

- [Documentation n8n](https://docs.n8n.io)
- [API Claude (Anthropic)](https://docs.anthropic.com)
- [API OpenAI](https://platform.openai.com/docs)
- [Twilio WhatsApp](https://www.twilio.com/docs/whatsapp)
- [Supabase](https://supabase.com/docs)

---

## 🤝 Support

Besoin d'aide ?
- **Issues GitHub** : [Créer une issue](https://github.com/votre-repo/issues)
- **Discord n8n** : [Rejoindre](https://discord.gg/n8n)

---

## 📝 Licence

MIT License - Utilisez et modifiez librement !

---

**Fait avec ❤️ par [Obra](https://obra.ai)**
