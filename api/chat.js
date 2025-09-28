export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { message } = req.body || {};

      // On forward directement à N8N
      const response = await fetch("https://n8n.srv586629.hstgr.cloud/webhook/obra/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const text = await response.text();

      // On renvoie tel quel au front
      return res.status(200).send(text);

    } catch (err) {
      console.error("Erreur côté Vercel:", err);
      return res.status(500).json({ error: "❌ Erreur côté Vercel", details: String(err) });
    }
  }

  return res.status(405).json({ error: "❌ Méthode non autorisée" });
}

