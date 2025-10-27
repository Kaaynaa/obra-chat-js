-- ============================================
-- OBRA - Schéma Base de Données Supabase
-- ============================================

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: profiles
-- Étend auth.users avec des informations supplémentaires
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'artisan', 'client')) DEFAULT 'client',
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: artisans
-- Informations spécifiques aux artisans
-- ============================================
CREATE TABLE IF NOT EXISTS public.artisans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  business_type TEXT, -- Type d'activité (plombier, électricien, etc.)
  siret TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: clients
-- Clients gérés par les artisans
-- ============================================
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'prospect')) DEFAULT 'prospect',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLE: projects
-- Projets entre artisans et clients
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  artisan_id UUID REFERENCES public.artisans(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('draft', 'in_progress', 'completed', 'cancelled')) DEFAULT 'draft',
  budget DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FONCTIONS: Mise à jour automatique updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artisans_updated_at BEFORE UPDATE ON public.artisans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FONCTION: Créer un profile automatiquement lors de l'inscription
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement un profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policies pour profiles
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Les admins peuvent tout voir" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Les admins peuvent tout modifier" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour artisans
CREATE POLICY "Les artisans peuvent voir leur propre fiche" ON public.artisans FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Les artisans peuvent mettre à jour leur propre fiche" ON public.artisans FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Les admins peuvent tout voir sur artisans" ON public.artisans FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Les admins peuvent tout modifier sur artisans" ON public.artisans FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour clients
CREATE POLICY "Les artisans peuvent voir leurs clients" ON public.clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.artisans WHERE id = artisan_id AND user_id = auth.uid())
);
CREATE POLICY "Les artisans peuvent gérer leurs clients" ON public.clients FOR ALL USING (
  EXISTS (SELECT 1 FROM public.artisans WHERE id = artisan_id AND user_id = auth.uid())
);
CREATE POLICY "Les admins peuvent tout voir sur clients" ON public.clients FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour projects
CREATE POLICY "Les artisans peuvent voir leurs projets" ON public.projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.artisans WHERE id = artisan_id AND user_id = auth.uid())
);
CREATE POLICY "Les artisans peuvent gérer leurs projets" ON public.projects FOR ALL USING (
  EXISTS (SELECT 1 FROM public.artisans WHERE id = artisan_id AND user_id = auth.uid())
);
CREATE POLICY "Les admins peuvent tout voir sur projects" ON public.projects FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- INDEX pour optimiser les performances
-- ============================================
CREATE INDEX idx_artisans_user_id ON public.artisans(user_id);
CREATE INDEX idx_clients_artisan_id ON public.clients(artisan_id);
CREATE INDEX idx_projects_artisan_id ON public.projects(artisan_id);
CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- ============================================
-- DONNÉES DE TEST (optionnel - à supprimer en production)
-- ============================================
-- Admin par défaut (créer manuellement via Supabase Auth ou votre interface)
-- INSERT INTO public.profiles (id, email, full_name, role) VALUES
-- ('uuid-admin', 'admin@obra.com', 'Admin Obra', 'admin');
