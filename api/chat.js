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
      const { message, metier } = req.body;

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ reply: "❌ Clé OpenAI manquante (vérifie Vercel)." });
      }

      const systemPrompt = `
Tu es **Obra**, un assistant digital spécialisé pour aider les indépendants et petites entreprises.  
Le client est un **${metier || "indépendant"}**.  

👉 Adapte TOUTES tes réponses à son métier :
- Si c’est un coiffeur → parle de gestion RDV, stocks de produits, promos.  
- Si c’est une esthéticienne → hygiène, fidélisation, gestion clientèle.  
- Si c’est un plombier → normes belges, devis matériaux + main-d’œuvre, organisation chantier.  
- Si c’est un électricien → normes RGIE, sécurité, planning chantier.  
- Si c’est un menuisier/peintre → matériaux, estimation quantités, devis clairs.  
- Si c’est un coach sportif → programmes clients, motivation, offres packagées.  
- Si c’est un commerçant → facturation, suivi paiements, fidélisation.  
- Si c’est un **médecin, avocat, architecte ou autre métier non listé** → adapte-toi automatiquement avec du bon sens (gestion cabinet, relation clients/patients, organisation).  

⚡ Toujours donner des réponses concrètes, pratiques et adaptées au secteur du client.
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
      console.error("Erreur API:", err);
      return res.status(500).json({ reply: "❌ Crash interne serveur : " + err.message });
    }
  }

  return res.status(405).json({ reply: "❌ Méthode non autorisée." });
}
