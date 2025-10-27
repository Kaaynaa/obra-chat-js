# 🚀 Quick Start - Agent IA WhatsApp

Démarrez votre agent IA WhatsApp en **15 minutes**.

---

## ⚡ Installation rapide

### 1. Prérequis (5 min)

```bash
# Vérifier que Docker est installé
docker --version

# Si pas installé, installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 2. Configuration (5 min)

```bash
# Cloner le repo (ou télécharger les fichiers)
git clone https://github.com/votre-repo/obra-whatsapp-ai
cd obra-whatsapp-ai/n8n-workflows

# Copier et éditer .env
cp .env.example .env
nano .env  # ou vim, code, etc.
```

**Remplissez AU MINIMUM ces variables** :

```bash
# Dans .env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxx      # De Twilio Console
TWILIO_WHATSAPP_NUMBER=+14155238886        # Votre numéro Twilio
ANTHROPIC_API_KEY=sk-ant-xxxxxxxx          # Clé API Claude
```

### 3. Démarrer (2 min)

```bash
# Lancer tout avec Docker Compose
docker-compose up -d

# Vérifier que tout fonctionne
docker ps
```

Vous devriez voir :
```
obra-n8n       ✅ Running
obra-postgres  ✅ Running
obra-traefik   ✅ Running
```

### 4. Importer les workflows (3 min)

1. Ouvrez n8n : `http://localhost:5678`
2. Login : `admin` / `changeme123` (changez-le !)
3. Cliquez sur **"+"** → **Import from File**
4. Importez `3-business-functions-whatsapp-ai.json`
5. Configurez les credentials :

#### Credentials à ajouter

**A. Twilio (HTTP Basic Auth)**
- Name: `Twilio Credentials`
- Username: Votre `TWILIO_ACCOUNT_SID`
- Password: Votre `TWILIO_AUTH_TOKEN`

**B. Anthropic API**
- Name: `Anthropic API`
- API Key: Votre `ANTHROPIC_API_KEY`

**C. PostgreSQL**
- Name: `Postgres Database`
- Host: `postgres` (si Docker) ou votre host Supabase
- Database: `n8n`
- User: `n8n`
- Password: celui dans votre `.env`
- Port: `5432`
- SSL: `disable` (si local) ou `require` (si Supabase)

### 5. Activer le workflow

1. Ouvrez le workflow importé
2. Cliquez sur **"Activate"** (toggle en haut à droite)
3. Notez l'URL du webhook (dans le node "Webhook WhatsApp")
   - Format: `https://votre-domaine.com/webhook/whatsapp-business`

### 6. Configurer Twilio

1. Allez sur [Twilio Console](https://console.twilio.com)
2. **Messaging** → **Try it out** → **Send a WhatsApp message**
3. Cliquez sur **Sandbox settings**
4. Dans **"When a message comes in"** :
   - Collez l'URL du webhook n8n
   - Method: **POST**
5. Sauvegardez

---

## ✅ Tester

### Test 1 : Message simple

Envoyez depuis WhatsApp :
```
Bonjour
```

Vous devriez recevoir une réponse de l'IA !

### Test 2 : Demande de devis

```
J'ai besoin d'un devis pour refaire ma plomberie
```

L'IA devrait :
1. Comprendre la demande
2. Créer un devis dans la BDD
3. Vous confirmer par WhatsApp

### Test 3 : Prise de RDV

```
Quand êtes-vous disponible cette semaine ?
```

L'IA devrait :
1. Chercher les disponibilités
2. Vous proposer des créneaux

---

## 🔍 Vérifier la BDD

```bash
# Se connecter à PostgreSQL
docker exec -it obra-postgres psql -U n8n

# Voir les devis créés
SELECT * FROM devis ORDER BY created_at DESC LIMIT 5;

# Voir les conversations
SELECT * FROM whatsapp_conversations ORDER BY timestamp DESC LIMIT 10;

# Quitter
\q
```

---

## 🌐 Exposer sur Internet

### Option 1 : ngrok (Test rapide)

```bash
# Installer ngrok
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok

# Lancer ngrok
ngrok http 5678
```

Copiez l'URL HTTPS (ex: `https://abc123.ngrok.io`) et mettez-la dans Twilio.

### Option 2 : Domaine + Traefik (Production)

1. Achetez un nom de domaine (ex: `n8n.votre-entreprise.com`)
2. Pointez-le vers votre serveur (DNS A record)
3. Modifiez `docker-compose.yml` :
   ```yaml
   traefik:
     # ...
     - "traefik.http.routers.n8n.rule=Host(`n8n.votre-entreprise.com`)"
   ```
4. Redémarrez :
   ```bash
   docker-compose down
   docker-compose up -d
   ```

Traefik va automatiquement créer un certificat SSL !

---

## 📊 Monitoring

### Voir les logs n8n

```bash
docker logs -f obra-n8n
```

### Voir les logs PostgreSQL

```bash
docker logs -f obra-postgres
```

### Dashboard Traefik

Ouvrez : `http://localhost:8080`

---

## ❌ Dépannage rapide

### Le webhook ne fonctionne pas

```bash
# Vérifier que n8n est accessible
curl http://localhost:5678

# Vérifier les logs
docker logs obra-n8n --tail 50

# Redémarrer
docker-compose restart n8n
```

### L'IA ne répond pas

1. Vérifiez que votre clé API Anthropic est valide
2. Vérifiez que vous avez des crédits
3. Regardez les exécutions dans n8n :
   - Allez dans **Executions** (barre de gauche)
   - Cliquez sur la dernière exécution
   - Regardez les erreurs éventuelles

### Erreur de connexion BDD

```bash
# Vérifier que PostgreSQL fonctionne
docker exec -it obra-postgres pg_isready

# Si erreur, voir les logs
docker logs obra-postgres
```

---

## 🎯 Prochaines étapes

Une fois que tout fonctionne :

1. **Personnalisez le prompt** dans le workflow
2. **Ajoutez vos services** dans les fonctions
3. **Connectez votre vrai CRM** (Supabase, etc.)
4. **Activez les notifications** Slack
5. **Configurez le backup** de la BDD

---

## 📚 Ressources

- [README complet](./README.md) - Documentation détaillée
- [Schéma BDD](./database-schema.sql) - Structure complète
- [Support n8n](https://community.n8n.io) - Forum communautaire

---

**Besoin d'aide ?**

Créez une issue sur GitHub ou contactez le support.

---

**Fait avec ❤️ pour Obra**
