// /api/chat.js
export default async function handler(req, res) {
  // Autoriser CORS
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
        message: { type: "text", text: message }
      };

      // Envoi vers ton webhook N8N
      const response = await fetch("https://n8n.srv586629.hstgr.cloud/webhook/obra/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      // Réponse envoyée au front
      return res.status(200).json({
        reply: data.reply ?? "❌ Pas de réponse reçue de N8N",
        agent: data.agent ?? null,
        status: data.status ?? "ok"
      });

    } catch (err) {
      console.error("Erreur côté Vercel:", err);
      return res.status(500).json({ reply: "❌ Erreur côté serveur Obra API", error: String(err) });
    }
  }

  return res.status(405).json({ reply: "❌ Méthode non autorisée." });
}

