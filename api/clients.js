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

    // GET - Lister les clients
    if (method === "GET" && !id) {
      let query = supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      // Si artisan, filtrer par ses clients uniquement
      if (profile.role === 'artisan' && artisanId) {
        query = query.eq('artisan_id', artisanId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return res.status(200).json({ data });
    }

    // GET - Obtenir un client par ID
    if (method === "GET" && id) {
      let query = supabase
        .from('clients')
        .select('*')
        .eq('id', id);

      // Si artisan, vérifier qu'il possède ce client
      if (profile.role === 'artisan' && artisanId) {
        query = query.eq('artisan_id', artisanId);
      }

      const { data, error } = await query.single();

      if (error) throw error;
      return res.status(200).json({ data });
    }

    // POST - Créer un nouveau client
    if (method === "POST") {
      const clientData = req.body;

      // Si artisan, forcer son artisan_id
      if (profile.role === 'artisan' && artisanId) {
        clientData.artisan_id = artisanId;
      }

      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ data, message: "Client créé avec succès" });
    }

    // PUT - Mettre à jour un client
    if (method === "PUT" && id) {
      const clientData = req.body;

      // Vérifier que le client appartient à l'artisan
      if (profile.role === 'artisan' && artisanId) {
        const { data: existingClient } = await supabase
          .from('clients')
          .select('artisan_id')
          .eq('id', id)
          .single();

        if (existingClient?.artisan_id !== artisanId) {
          return res.status(403).json({ error: "Accès interdit à ce client" });
        }
      }

      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ data, message: "Client mis à jour" });
    }

    // DELETE - Supprimer un client
    if (method === "DELETE" && id) {
      // Vérifier que le client appartient à l'artisan
      if (profile.role === 'artisan' && artisanId) {
        const { data: existingClient } = await supabase
          .from('clients')
          .select('artisan_id')
          .eq('id', id)
          .single();

        if (existingClient?.artisan_id !== artisanId) {
          return res.status(403).json({ error: "Accès interdit à ce client" });
        }
      }

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({ message: "Client supprimé" });
    }

    return res.status(405).json({ error: "Méthode non autorisée" });

  } catch (error) {
    console.error('Erreur API clients:', error);
    return res.status(500).json({ error: error.message });
  }
}
