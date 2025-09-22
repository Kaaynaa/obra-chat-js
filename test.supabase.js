import { supabase } from "../lib/supabase.js";

export default async function handler(req, res) {
  const { data, error } = await supabase.from("users").select("*").limit(5);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ data });
}
