export default async function handler(req, res) {
  // --- CORS FIX ---
  res.setHeader("Access-Control-Allow-Origin", "*"); // mets "*" ou "https://app.suitedash.com"
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Préflight ok
  }
  // --- FIN CORS FIX ---

  if (req.method === "POST") {
    try {
      const { message } = req.body;

      // ====== EXEMPLE GPT ======
      const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // Mets ta clé API dans Vercel
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: message }],
        }),
      });

      const data = await apiRes.json();
      const reply = data.choices?.[0]?.message?.content || "Pas de réponse reçue.";

      return res.status(200).json({ reply });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
