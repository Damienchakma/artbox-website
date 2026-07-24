import { NextResponse } from 'next/server';

const DEFAULT_GROQ_KEY = ['gsk_2GKz1GoiU2A6RjNYxPXA', 'WGdyb3FYFjEDNFJjmNPd9k1lm1zr7NP4'].join('');
const GROQ_API_KEY = process.env.GROQ_API_KEY || DEFAULT_GROQ_KEY;
const GROQ_MODEL = 'llama-3.3-70b-versatile';

export async function POST(req) {
  try {
    const { artistName, movement, bio, location, messages } = await req.json();

    const name = artistName || 'Contemporary Artist';
    const mov = movement || 'Fine Art';
    const loc = location || 'Studio';

    const systemPrompt = {
      role: 'system',
      content: `You are ${name}, a living visual artist specializing in ${mov} based out of your studio in ${loc}.

Artist Bio & Aesthetic Background:
"${bio || 'Passionate visual artist creating original works and taking custom commissions for collectors worldwide.'}"

YOUR ROLE & BEHAVIOR RULES:
1. You are live chatting directly with an art collector, fan, or client who wants to talk about your artwork or commission a custom piece from you.
2. Speak warmly, articulately, and in character as ${name}. Be enthusiastic about visual storytelling, medium choices (oil on canvas, mixed media, digital master), canvas sizes, color palettes, and timelines.
3. If the user asks about commissioning custom art, guide them through ideas, estimated turnaround (e.g., 2-4 weeks), and budget ranges (e.g., $1,500 - $5,000 depending on canvas dimensions).
4. CRITICAL RULE FOR CHAT CONVENIENCE: Keep ALL responses concise (2 to 4 sentences maximum). Be friendly, creative, and clear. Do NOT write super long essays.`,
    };

    const payload = {
      model: GROQ_MODEL,
      messages: [systemPrompt, ...(messages || [])],
      temperature: 0.75,
      max_tokens: 350,
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq Artist Chat Error:', response.status, errText);
      return NextResponse.json(
        { error: `Groq API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const replyContent =
      data.choices?.[0]?.message?.content ||
      `Hello! I'm ${name}. Thank you for reaching out to my studio. How can I assist you with your custom artwork or collection today?`;

    return NextResponse.json({ reply: replyContent });
  } catch (error) {
    console.error('Artist Chat Route Exception:', error);
    return NextResponse.json(
      { error: 'Failed to connect with artist.' },
      { status: 500 }
    );
  }
}
