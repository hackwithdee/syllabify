import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { goal, skillLevel, timeframe, dailyHours } = await req.json();
    if (!goal) {
      return new Response(JSON.stringify({ error: "Goal is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const level = skillLevel || "beginner";
    const time = timeframe || "3 months";
    const hours = dailyHours || 1;

    const systemPrompt = `You are an expert learning roadmap generator. Given a learning goal, skill level, timeframe, and daily study availability, create a comprehensive structured syllabus.

The learner's current level is "${level}", they have ${time} to learn, and can study ${hours} hour(s) per day.

Create phases appropriate for their level:
- If beginner: start from Beginner phase, include Intermediate and Advanced
- If intermediate: brief Beginner review, focus on Intermediate and Advanced
- If advanced: focus on Advanced and Specialization

Each phase should have 3-5 topics. Each topic must include:
- A clear title
- Description of what to learn
- How to learn it (specific instructions)
- Recommended resources with real URLs
- Alternative resources with real URLs
- A practice task or mini-project
- Estimated study time in hours
- What the learner should be able to do after (outcome)`;

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
          { role: "user", content: `Create a complete learning roadmap for: "${goal}"` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_roadmap",
              description: "Return a structured learning roadmap with phases and detailed topics.",
              parameters: {
                type: "object",
                properties: {
                  phases: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", enum: ["foundation", "intermediate", "advanced", "certification"] },
                        label: { type: "string" },
                        topics: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              title: { type: "string" },
                              description: { type: "string" },
                              howToLearn: { type: "string" },
                              outcome: { type: "string" },
                              practiceTask: { type: "string" },
                              estimatedHours: { type: "number" },
                              resources: {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    title: { type: "string" },
                                    url: { type: "string" },
                                    type: { type: "string", enum: ["primary", "alternative"] },
                                  },
                                  required: ["title", "url", "type"],
                                  additionalProperties: false,
                                },
                              },
                            },
                            required: ["title", "description", "howToLearn", "outcome", "practiceTask", "estimatedHours", "resources"],
                            additionalProperties: false,
                          },
                        },
                      },
                      required: ["id", "label", "topics"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["phases"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_roadmap" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const parsed = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-roadmap error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
