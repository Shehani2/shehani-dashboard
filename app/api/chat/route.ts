import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey =
      process.env.GROQ_API_KEY ||
      "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";

    // Format conversation history for Groq Llama-3 API
    const formattedMessages = [
      {
        role: "system",
        content:
          "You are Rose, an encouraging, smart, aesthetic AI Assistant for Shehani. Shehani is a third-year university student and aspiring Business Analyst. Help her organize daily plans, productivity, habits, study routines, and career advice with friendly, short, sweet, and structured answers in English or Singlish.",
      },
      ...messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      })),
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: formattedMessages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq Error Data:", data);
      return NextResponse.json(
        { error: data?.error?.message || "Groq API error" },
        { status: response.status }
      );
    }

    const responseText =
      data?.choices?.[0]?.message?.content ||
      "Hi Shehani! How can I help you today?";

    return NextResponse.json({ text: responseText });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error?.message || "Server Error" },
      { status: 500 }
    );
  }
}