export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { message } = req.body;

      const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o", // 🔥 le modèle le plus puissant aujourd’hui
          messages: [
            { role: "system", content: "Tu es Obra, un assistant pour artisans et entrepreneurs." },
            { role: "user", content: message }
          ],
        }),
      });

      const data = await apiRes.json();

      if (data.error) {
        return res.status(500).json({ error: data.error });
      }

      const reply = data?.choices?.[0]?.message?.content || "❌ Pas de réponse reçue.";
      return res.status(200).json({ reply });

    } catch (err) {
      console.error("Erreur API:", err);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
