export default async function handler(req, res) {
  // CORS (autoriser les requêtes cross-origins si le front est sur autre domaine)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Répondre aux OPTIONS (pré-vol) directement
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { message, userId, userName } = req.body;

      // Préparer le payload pour n8n
      const payload = {
        channel: "obra_chat",
        user: { id: userId || "anon", name: userName || "Anonyme" },
        message: { type: "text", text: message }
      };

      // Appel vers le webhook n8n
      const r = await fetch("https://n8n.srv586629.hstgr.cloud/webhook/obra/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      // Si n8n ne répond pas JSON, ça plante
      const data = await r.json();

      // Formater la réponse pour le front
      return res.status(200).json({
        reply: data.reply ?? "❌ Pas de réponse reçue de n8n.",
        agent: data.agent ?? null,
        status: data.status ?? "ok"
      });

    } catch (err) {
      console.error("Error in /api/chat:", err);
      return res.status(500).json({ reply: "❌ Erreur côté serveur Obra API", error: err.message });
    }
  }

  // Si méthode HTTP non gérée
  return res.status(405).json({ reply: "❌ Méthode non autorisée." });
}
