export default async function handler(req, res) {
  // --- FIX CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*"); // ou mets "https://app.suitedash.com"
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Répond direct aux pré-requêtes CORS
  }
  // --- FIN FIX CORS ---

  if (req.method === "POST") {
    const { message } = req.body;

    // ton code GPT ici
    const reply = "réponse générée";

    return res.status(200).json({ reply });
  }

  res.status(405).json({ error: "Method not allowed" });
}
