export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    try {
      const { message, userId, userName } = req.body;

      const payload = {
        channel: "obra_chat",
        user: { id: userId || "anon", name: userName || "Anonyme" },
        message: { type: "text", text: message }
      };

      // 🔗 forward vers ton webhook n8n
      const r = await fetch("https://n8n.srv586629.hstgr.cloud/webhook/obra/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await r.json();
      return res.status(200).json(data);

    } catch (err) {
      return res.status(500).json({ reply: "❌ Erreur côté Obra API : " + err.message });
    }
  }

  return res.status(405).json({ reply: "❌ Méthode non autorisée." });
}
