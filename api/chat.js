export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    try {
      const { message } = req.body;

      const systemPrompt = `
Tu es **Obra**, un assistant digital pour artisans, indépendants et pros du service.
Analyse toujours le message du client et détecte son métier automatiquement (plombier, électricien, coiffeur, esthéticienne, médecin, avocat, architecte, coach sportif, etc.).
Adapte tes réponses à ce métier. Si rien n’est clair, reste généraliste.
Réponds toujours de façon concrète et pratique.
      `;

      const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
        }),
      });

      const data = await apiRes.json();

      if (data.error) {
        return res.status(500).json({ reply: "❌ Erreur OpenAI : " + data.error.message });
      }

      const reply = data?.choices?.[0]?.message?.content || "❌ Pas de réponse reçue.";
      return res.status(200).json({ reply });
    } catch (err) {
      return res.status(500).json({ reply: "❌ Erreur interne serveur : " + err.message });
    }
  }

  return res.status(405).json({ reply: "❌ Méthode non autorisée." });
}

