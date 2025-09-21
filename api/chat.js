export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { message } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ reply: "❌ Clé OpenAI manquante (vérifie Vercel)." });
      }

      const systemPrompt = `
Tu es **Obra**, un assistant digital spécialisé pour tous les indépendants, artisans et professions libérales.
Ta mission : détecter automatiquement le métier du client à partir de ses messages, puis adapter tes réponses.

### Règles :
- Si le message parle d'électricité, normes RGIE, câbles → c’est un **électricien**.
- Si ça parle de tuyaux, diamètres, pentes → c’est un **plombier**.
- Si ça parle de devis peinture, carrelage, bois → c’est un **peintre, carreleur ou menuisier**.
- Si ça parle de planning rendez-vous, stocks produits, coloration → c’est un **coiffeur**.
- Si ça parle d’hygiène, soins, esthétique → c’est une **esthéticienne**.
- Si ça parle de séances, programmes, abonnements → c’est un **coach sportif**.
- Si ça parle de dossiers, cabinet, clients juridiques → c’est un **avocat**.
- Si ça parle de patients, cabinet médical → c’est un **médecin**.
- Si ça parle de plans, chantier, construction → c’est un **architecte**.
- Si ça ne correspond pas clairement → reste en **assistant généraliste**.

⚡ Réponds toujours de façon claire, pratique, et adaptée au métier que tu as détecté.
      `;

      const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // rapide et économique
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
      console.error("Erreur API:", err);
      return res.status(500).json({ reply: "❌ Crash interne serveur : " + err.message });
    }
  }

  return res.status(405).json({ reply: "❌ Méthode non autorisée." });
}
