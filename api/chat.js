export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    try {
      const { message, userId, userName } = req.body || {};

      // Payload envoyé à N8N
      const payload = {
        channel: "obra_chat",
        user: { id: userId || "anon", name: userName || "Anonyme" },
        message: { type: "text", text: message || "" }
      };

      // Appel à ton webhook N8N
      const response = await fetch("https://n8n.srv586629.hstgr.cloud/webhook/obra/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let data;
      try {
        data = await response.json();
      } catch {
        return res.status(500).json({ reply: "❌ Réponse N8N invalide (pas JSON)" });
      }

      return res.status(200).json(data);

    } catch (err) {
      console.error("Erreur dans /api/chat:", err);
      return res.status(500).json({ reply: "❌ Erreur serveur Obra API", error: String(err) });
    }
  }

  return res.status(405).json({ reply: "❌ Méthode non autorisée." });
}

