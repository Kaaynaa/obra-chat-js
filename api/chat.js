export default async function handler(req, res) {
  // Autoriser CORS (utile si ton front est dans SuiteDash ou autre domaine)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { message, userId, userName } = req.body;

      // Construire le payload pour N8N
      const payload = {
        channel: "obra_chat",
        user: { id: userId || "anon", name: userName || "Anonyme" },
        message: { type: "text", text: message }
      };

      // Appel vers le webhook N8N
      const r = await fetch("https://n8n.srv586629.hstgr.cloud/webhook/obra/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Tenter de lire la réponse JSON
      const data = await r.json();

      // Vérifier si N8N a bien répondu
      return res.status(200).json({
        reply: data.reply ?? "❌ Pas de réponse reçue de N8N.",
        agent: data.agent ?? null,
        status: data.status ?? "ok"
      });

    } catch (err) {
      console.error("Erreur côté API Chat:", err);
      return res.status(500).json({
        reply: "❌ Erreur interne serveur Obra API",
        error: err.message
      });
    }
  }

  return res.status(405).json({ reply: "❌ Méthode non autorisée." });
}
