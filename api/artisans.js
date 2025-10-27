import { supabase } from "../lib/supabase.js";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { method } = req;
  const { id } = req.query;

  try {
    // Vérifier l'authentification
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    // Vérifier que l'utilisateur est admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return res.status(403).json({ error: "Accès interdit" });
    }

    // GET - Lister tous les artisans
    if (method === "GET" && !id) {
      const { data, error } = await supabase
        .from('artisans')
        .select(`
          *,
          profiles:user_id (
            id,
            email,
            full_name,
            phone,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ data });
    }

    // GET - Obtenir un artisan par ID
    if (method === "GET" && id) {
      const { data, error } = await supabase
        .from('artisans')
        .select(`
          *,
          profiles:user_id (
            id,
            email,
            full_name,
            phone,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return res.status(200).json({ data });
    }

    // POST - Créer un nouvel artisan
    if (method === "POST") {
      const { email, password, full_name, phone, ...artisanData } = req.body;

      // Créer l'utilisateur
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: password || Math.random().toString(36).slice(-8),
        email_confirm: true
      });

      if (authError) throw authError;

      // Mettre à jour le profil
      await supabase
        .from('profiles')
        .update({
          role: 'artisan',
          full_name,
          phone
        })
        .eq('id', authData.user.id);

      // Créer l'artisan
      const { data, error } = await supabase
        .from('artisans')
        .insert({
          user_id: authData.user.id,
          ...artisanData
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ data, message: "Artisan créé avec succès" });
    }

    // PUT - Mettre à jour un artisan
    if (method === "PUT" && id) {
      const { full_name, phone, ...artisanData } = req.body;

      // Récupérer l'artisan
      const { data: artisan } = await supabase
        .from('artisans')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!artisan) {
        return res.status(404).json({ error: "Artisan non trouvé" });
      }

      // Mettre à jour le profil
      if (full_name || phone) {
        await supabase
          .from('profiles')
          .update({
            full_name,
            phone
          })
          .eq('id', artisan.user_id);
      }

      // Mettre à jour l'artisan
      const { data, error } = await supabase
        .from('artisans')
        .update(artisanData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ data, message: "Artisan mis à jour" });
    }

    // DELETE - Supprimer un artisan
    if (method === "DELETE" && id) {
      const { error } = await supabase
        .from('artisans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({ message: "Artisan supprimé" });
    }

    return res.status(405).json({ error: "Méthode non autorisée" });

  } catch (error) {
    console.error('Erreur API artisans:', error);
    return res.status(500).json({ error: error.message });
  }
}
