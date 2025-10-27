-- =====================================================
-- SCHEMA BASE DE DONNÉES POUR AGENT IA WHATSAPP
-- =====================================================
-- Compatible PostgreSQL / Supabase
-- Version: 1.0
-- =====================================================

-- Table: whatsapp_conversations
-- Stocke tous les messages WhatsApp (in et out)
CREATE TABLE IF NOT EXISTS whatsapp_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) NOT NULL,
    sender_name VARCHAR(255),
    message_in TEXT NOT NULL,
    message_out TEXT,
    intent VARCHAR(50),
    urgency VARCHAR(20) DEFAULT 'normal',
    category VARCHAR(50),
    ai_model VARCHAR(100),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide par téléphone
CREATE INDEX idx_phone_number ON whatsapp_conversations(phone_number);
CREATE INDEX idx_timestamp ON whatsapp_conversations(timestamp DESC);
CREATE INDEX idx_urgency ON whatsapp_conversations(urgency);

-- =====================================================

-- Table: clients
-- Base de données clients (CRM)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) UNIQUE NOT NULL,
    company_name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    source VARCHAR(50) DEFAULT 'whatsapp', -- whatsapp, website, phone, etc.
    status VARCHAR(50) DEFAULT 'prospect', -- prospect, active, inactive
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_client_phone ON clients(phone);
CREATE INDEX idx_client_email ON clients(email);
CREATE INDEX idx_client_status ON clients(status);

-- =====================================================

-- Table: devis
-- Gestion des devis
CREATE TABLE IF NOT EXISTS devis (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    service_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    montant DECIMAL(10, 2),
    urgence BOOLEAN DEFAULT FALSE,
    statut VARCHAR(50) DEFAULT 'en_attente', -- en_attente, envoye, accepte, refuse, expire
    date_envoi DATE,
    date_validite DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    source VARCHAR(50) DEFAULT 'whatsapp_ai'
);

-- Index
CREATE INDEX idx_devis_phone ON devis(client_phone);
CREATE INDEX idx_devis_statut ON devis(statut);
CREATE INDEX idx_devis_created ON devis(created_at DESC);

-- =====================================================

-- Table: rendez_vous
-- Gestion des rendez-vous
CREATE TABLE IF NOT EXISTS rendez_vous (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    type_intervention VARCHAR(100) NOT NULL,
    date_souhaitee VARCHAR(100),
    date_confirmee TIMESTAMPTZ,
    adresse TEXT,
    statut VARCHAR(50) DEFAULT 'a_confirmer', -- a_confirmer, confirme, realise, annule
    notes TEXT,
    technicien_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    source VARCHAR(50) DEFAULT 'whatsapp_ai'
);

-- Index
CREATE INDEX idx_rdv_phone ON rendez_vous(client_phone);
CREATE INDEX idx_rdv_date ON rendez_vous(date_confirmee);
CREATE INDEX idx_rdv_statut ON rendez_vous(statut);

-- =====================================================

-- Table: agenda
-- Disponibilités de l'équipe
CREATE TABLE IF NOT EXISTS agenda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date TIMESTAMPTZ NOT NULL,
    technicien_id UUID,
    technicien_name VARCHAR(255),
    statut VARCHAR(50) DEFAULT 'disponible', -- disponible, reserve, occupe
    type VARCHAR(100), -- intervention, devis, maintenance, etc.
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_agenda_date ON agenda(date);
CREATE INDEX idx_agenda_statut ON agenda(statut);
CREATE INDEX idx_agenda_technicien ON agenda(technicien_id);

-- =====================================================

-- Table: projets
-- Suivi des projets
CREATE TABLE IF NOT EXISTS projets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    devis_id INTEGER REFERENCES devis(id) ON DELETE SET NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    montant DECIMAL(10, 2),
    statut VARCHAR(50) DEFAULT 'en_cours', -- en_cours, termine, annule, suspendu
    date_debut DATE,
    date_fin_prevue DATE,
    date_fin_reelle DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_projet_client ON projets(client_id);
CREATE INDEX idx_projet_statut ON projets(statut);

-- =====================================================

-- Table: factures
-- Gestion des factures
CREATE TABLE IF NOT EXISTS factures (
    id SERIAL PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    projet_id UUID REFERENCES projets(id) ON DELETE SET NULL,
    numero_facture VARCHAR(50) UNIQUE NOT NULL,
    montant_ht DECIMAL(10, 2) NOT NULL,
    montant_tva DECIMAL(10, 2) NOT NULL,
    montant_ttc DECIMAL(10, 2) NOT NULL,
    statut VARCHAR(50) DEFAULT 'en_attente', -- en_attente, envoyee, payee, en_retard
    date_emission DATE NOT NULL,
    date_echeance DATE NOT NULL,
    date_paiement DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_facture_client ON factures(client_id);
CREATE INDEX idx_facture_statut ON factures(statut);
CREATE INDEX idx_facture_numero ON factures(numero_facture);

-- =====================================================

-- TRIGGERS POUR UPDATED_AT

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger aux tables
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devis_updated_at BEFORE UPDATE ON devis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rdv_updated_at BEFORE UPDATE ON rendez_vous
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projets_updated_at BEFORE UPDATE ON projets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_factures_updated_at BEFORE UPDATE ON factures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================

-- VUES UTILES

-- Vue: Stats clients par source
CREATE OR REPLACE VIEW v_clients_by_source AS
SELECT
    source,
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
    COUNT(CASE WHEN status = 'prospect' THEN 1 END) as prospects
FROM clients
GROUP BY source;

-- Vue: Devis en attente
CREATE OR REPLACE VIEW v_devis_pending AS
SELECT
    d.*,
    c.full_name,
    c.email,
    c.phone
FROM devis d
LEFT JOIN clients c ON d.client_id = c.id
WHERE d.statut = 'en_attente'
ORDER BY d.urgence DESC, d.created_at DESC;

-- Vue: RDV à confirmer
CREATE OR REPLACE VIEW v_rdv_to_confirm AS
SELECT
    r.*,
    c.full_name,
    c.email
FROM rendez_vous r
LEFT JOIN clients c ON r.client_id = c.id
WHERE r.statut = 'a_confirmer'
ORDER BY r.created_at DESC;

-- =====================================================

-- DONNÉES DE TEST (OPTIONNEL)

-- Insérer quelques disponibilités
INSERT INTO agenda (date, statut, technicien_name) VALUES
    (NOW() + INTERVAL '1 day' + INTERVAL '9 hours', 'disponible', 'Jordan'),
    (NOW() + INTERVAL '1 day' + INTERVAL '14 hours', 'disponible', 'Jordan'),
    (NOW() + INTERVAL '2 days' + INTERVAL '10 hours', 'disponible', 'Jordan'),
    (NOW() + INTERVAL '3 days' + INTERVAL '9 hours', 'disponible', 'Jordan'),
    (NOW() + INTERVAL '3 days' + INTERVAL '15 hours', 'disponible', 'Jordan');

-- =====================================================
-- FIN DU SCHEMA
-- =====================================================
