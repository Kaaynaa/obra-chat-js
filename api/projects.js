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

    // Récupérer le profil et vérifier le rôle
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'artisan' && profile?.role !== 'admin') {
      return res.status(403).json({ error: "Accès interdit" });
    }

    // Si artisan, récupérer son ID
    let artisanId = null;
    if (profile.role === 'artisan') {
      const { data: artisan } = await supabase
        .from('artisans')
        .select('id')
        .eq('user_id', user.id)
        .single();

      artisanId = artisan?.id;
    }

    // GET - Lister les projets
    if (method === "GET" && !id) {
      let query = supabase
        .from('projects')
        .select(`
          *,
          client:client_id (
            id,
            full_name,
            email,
            company_name
          )
        `)
        .order('created_at', { ascending: false });

      // Si artisan, filtrer par ses projets uniquement
      if (profile.role === 'artisan' && artisanId) {
        query = query.eq('artisan_id', artisanId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return res.status(200).json({ data });
    }

    // GET - Obtenir un projet par ID
    if (method === "GET" && id) {
      let query = supabase
        .from('projects')
        .select(`
          *,
          client:client_id (
            id,
            full_name,
            email,
            company_name
          )
        `)
        .eq('id', id);

      // Si artisan, vérifier qu'il possède ce projet
      if (profile.role === 'artisan' && artisanId) {
        query = query.eq('artisan_id', artisanId);
      }

      const { data, error } = await query.single();

      if (error) throw error;
      return res.status(200).json({ data });
    }

    // POST - Créer un nouveau projet
    if (method === "POST") {
      const projectData = req.body;

      // Si artisan, forcer son artisan_id
      if (profile.role === 'artisan' && artisanId) {
        projectData.artisan_id = artisanId;

        // Vérifier que le client appartient à l'artisan
        const { data: client } = await supabase
          .from('clients')
          .select('artisan_id')
          .eq('id', projectData.client_id)
          .single();

        if (client?.artisan_id !== artisanId) {
          return res.status(403).json({ error: "Ce client ne vous appartient pas" });
        }
      }

      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ data, message: "Projet créé avec succès" });
    }

    // PUT - Mettre à jour un projet
    if (method === "PUT" && id) {
      const projectData = req.body;

      // Vérifier que le projet appartient à l'artisan
      if (profile.role === 'artisan' && artisanId) {
        const { data: existingProject } = await supabase
          .from('projects')
          .select('artisan_id')
          .eq('id', id)
          .single();

        if (existingProject?.artisan_id !== artisanId) {
          return res.status(403).json({ error: "Accès interdit à ce projet" });
        }

        // Si le client_id change, vérifier qu'il appartient à l'artisan
        if (projectData.client_id) {
          const { data: client } = await supabase
            .from('clients')
            .select('artisan_id')
            .eq('id', projectData.client_id)
            .single();

          if (client?.artisan_id !== artisanId) {
            return res.status(403).json({ error: "Ce client ne vous appartient pas" });
          }
        }
      }

      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ data, message: "Projet mis à jour" });
    }

    // DELETE - Supprimer un projet
    if (method === "DELETE" && id) {
      // Vérifier que le projet appartient à l'artisan
      if (profile.role === 'artisan' && artisanId) {
        const { data: existingProject } = await supabase
          .from('projects')
          .select('artisan_id')
          .eq('id', id)
          .single();

        if (existingProject?.artisan_id !== artisanId) {
          return res.status(403).json({ error: "Accès interdit à ce projet" });
        }
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({ message: "Projet supprimé" });
    }

    return res.status(405).json({ error: "Méthode non autorisée" });

  } catch (error) {
    console.error('Erreur API projects:', error);
    return res.status(500).json({ error: error.message });
  }
}
