import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface VideoContext {
  title: string;
  transcript: string;
  summary: string;
  keyPoints: string[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context, language } = await req.json() as {
      messages: ChatMessage[];
      context: VideoContext;
      language: "hu" | "en";
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = language === "hu" 
      ? `Te egy segítőkész AI asszisztens vagy, aki egy YouTube videóval kapcsolatos kérdésekre válaszol.

A videó címe: "${context.title}"

A videó összefoglalója:
${context.summary}

Főbb pontok:
${context.keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}

${context.transcript ? `A videó átirata:\n${context.transcript}` : ""}

Kérlek, válaszolj a felhasználó kérdéseire a videó tartalma alapján. Legyél informatív és segítőkész. Ha valamit nem tudsz biztosan a videóból, jelezd ezt. Válaszolj magyarul.`
      : `You are a helpful AI assistant answering questions about a YouTube video.

Video title: "${context.title}"

Video summary:
${context.summary}

Key points:
${context.keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}

${context.transcript ? `Video transcript:\n${context.transcript}` : ""}

Please answer the user's questions based on the video content. Be informative and helpful. If you're not certain about something from the video, indicate this. Answer in English.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const assistantResponse = data.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("video-chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
