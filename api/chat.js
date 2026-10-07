const BUSINESS_INFO = `
Business name: Your Business Name
What we do: (describe your products or services)
Opening hours: Mon-Sat, 9 AM to 8 PM. Closed Sunday.
Location: (your address)
Phone / WhatsApp: (your number)
Prices and offers: (list main items and prices)
Refund / return policy: (your policy)
`;

const SYSTEM_PROMPT = `You are a friendly customer support assistant for the business below.
Answer only using the business information. Keep answers short and simple.
If you do not know something, say so politely and ask the customer to call or WhatsApp the business.
Reply in the same language the customer writes in (English or Tamil).

${BUSINESS_INFO}`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const { messages } = req.body;
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": (process.env.ANTHROPIC_API_KEY || "").trim(),
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-12),
      }),
    });
    const data = await r.json();
    const reply =
      data.content?.[0]?.text ||
      "Error: " + (data.error?.message || "unknown");
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ reply: "Error: " + e.message });
  }
}
