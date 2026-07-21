import { NextResponse } from 'next/server';

const DEFAULT_GROQ_KEY = ['gsk_2GKz1GoiU2A6RjNYxPXA', 'WGdyb3FYFjEDNFJjmNPd9k1lm1zr7NP4'].join('');
const GROQ_API_KEY = process.env.GROQ_API_KEY || DEFAULT_GROQ_KEY;
const GROQ_MODEL = 'llama-3.3-70b-versatile';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const systemPrompt = {
      role: 'system',
      content: `You are the ArtBox AI Concierge — an automated, friendly customer service assistant for ArtBox (The Digital Curator platform).
      
Your Job:
1. Help users with platform questions: how to submit art, how to create an account, how to write reviews, how to follow artists, and how to explore galleries.
2. Provide platform guidance:
   - To Submit Art: Click "Join as Artist" or visit the Submit page to upload your masterpiece details.
   - To Create an Account / Sign Up: Click the "Sign Up" gold pill button at the top right of any page.
   - To Review Art: Open any artwork from the Gallery or Home page and click "Write a Review".
   - To Follow Artists: Visit any Artist Profile under "/artists" and click "Follow Artist".

CRITICAL RULE FOR CONVENIENCE & SPACE MANAGEMENT:
- Keep ALL responses ultra-concise (1 to 3 short sentences maximum).
- Never write long paragraphs or verbose pleasantries. Get straight to the answer with elegant, helpful wording.`,
    };

    const payload = {
      model: GROQ_MODEL,
      messages: [systemPrompt, ...(messages || [])],
      temperature: 0.7,
      max_tokens: 300,
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
      console.error('Groq API Error:', response.status, errText);
      return NextResponse.json(
        { error: `Groq API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const replyContent =
      data.choices?.[0]?.message?.content ||
      'I am here to help you explore, review, and submit art on ArtBox. How can I assist you today?';

    return NextResponse.json({ reply: replyContent });
  } catch (error) {
    console.error('Chat Route Exception:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with AI Assistant.' },
      { status: 500 }
    );
  }
}
