export default async function handler(req, res) {
  // ✅ Bloquer les requêtes autres que POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ✅ Récupérer le message envoyé depuis ton front
    const { message } = req.body;

    // ✅ Appel à l’API OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // clé stockée sur Vercel
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // modèle rapide et pas cher
        messages: [
          {
            role: "system",
            content: "Tu es Obra, un assistant spécialisé en devis et gestion pour les artisans en Belgique. Tu aides à créer des devis précis, structurés et conformes au marché."
          },
          { role: "user", content: message }
        ],
      }),
    });

    const data = await response.json();

    // ✅ Retourner la réponse au front (Obra)
    return res.status(200).json(data);

  } catch (error) {
    // ✅ Si erreur
    return res.status(500).json({ error: error.message });
  }
}
