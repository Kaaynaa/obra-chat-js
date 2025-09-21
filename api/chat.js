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
        return res.status(500).json({ reply: "❌ Clé OpenAI manquante (vérifie tes variables dans Vercel)." });
      }

      const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // ⚡ plus rapide et moins cher
          messages: [
            {
              role: "system",
              content: `Tu es **Obra**, un assistant digital conçu pour aider les artisans, commerçants et indépendants 
              (plombiers, électriciens, coiffeurs, esthéticiennes, menuisiers, peintres, etc.).
              
              Tes missions :
              - Aider à rédiger des devis, factures et relances clients.
              - Donner des conseils pratiques (gestion de planning, organisation, relation client).
              - Fournir des explications simples sur les normes belges (ex. RGIE pour électriciens, règles de plomberie, hygiène pour coiffeurs/esthéticiennes).
              - Adapter ton langage : professionnel, clair, jamais trop technique si ce n’est pas nécessaire.
              - Répondre rapidement, de façon utile, comme un vrai assistant de confiance.
              
              IMPORTANT :
              - Si tu n’as pas la réponse exacte, propose une solution logique ou une démarche concrète.
              - Tu parles comme un assistant qui connaît le terrain (exemples concrets : planning de rendez-vous, prix moyens, astuces pratiques).
              `
            },
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

