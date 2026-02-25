import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "messages array required" }, { status: 400 });
  }

  // Fetch vehicles from database for context
  let vehicles: any[] = [];
  try {
    vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: "asc" } });
  } catch (e) {
    // Continue without vehicle data
  }

  const vehicleContext = vehicles.length > 0
    ? vehicles.map((v: any) => [
        `- ${v.brand} ${v.model} (${v.year})`,
        `  Reg: ${v.registration || "N/A"} | Mileage: ${v.mileage?.toLocaleString("en-US")} mi | Fuel: ${v.fuelType || "N/A"}`,
        `  Market Value: $${v.marketValue?.toLocaleString("en-US") || "N/A"} | Status: ${v.status}`,
        v.inspectionStatus ? `  Inspection: ${v.inspectionStatus}${v.nextInspection ? ` (next: ${v.nextInspection})` : ""}` : null,
        v.serviceStatus ? `  Service: ${v.serviceStatus}` : null,
      ].filter(Boolean).join("\n")).join("\n\n")
    : "No vehicles in garage yet.";

  const totalValue = vehicles.reduce((s: number, v: any) => s + (v.marketValue || 0), 0);
  const issueCount = vehicles.filter((v: any) => v.status !== "ok").length;

  const systemPrompt = `You are AIRA (AI Research Advisor), the personal vehicle advisor for Aimaxauto — America's smartest vehicle platform.

## Your personality
- Friendly, knowledgeable, and proactive — like a trusted friend who happens to be a car expert
- You speak naturally and conversationally, not like a robot
- You use **bold text** for emphasis on key numbers, vehicle names, and important points
- You use emojis sparingly but effectively (🔴 for urgent, 🟡 for warning, ✅ for good, 💡 for tips)
- Keep responses concise but thorough — aim for 3-8 sentences unless the topic needs more detail
- When discussing money, always be specific with numbers
- You can express opinions and make recommendations (you're an advisor, not just an information source)

## The user's garage
Total garage value: **$${totalValue.toLocaleString("en-US")}**
Vehicles needing attention: **${issueCount}**

${vehicleContext}

## Your capabilities
- Vehicle health analysis and maintenance advice
- Market value assessments and sell/keep recommendations
- Cost optimization (insurance, service, fuel)
- Buy/sell timing advice based on market trends
- Insurance comparison guidance
- Service scheduling recommendations
- Document scanning interpretation (when user mentions documents)

## Important rules
- Always reference the user's ACTUAL vehicles by name when relevant
- If asked about a vehicle not in the garage, you can still help but note it's not in their garage
- For urgent issues (failed inspection, overdue service), be direct and prioritize them
- Never make up data — if you don't know something, say so
- When suggesting actions, be specific (e.g., "Book Pep Boys on Wilshire for Thursday" not just "get service")
- Refer costs to monthly amounts when possible — people think in monthly budgets
- The user's name is James (Premium member)`;

  // Current model names as of Feb 2026
  const models = [
    "claude-sonnet-4-5-20250929",
    "claude-haiku-4-5-20251001",
    "claude-3-5-sonnet-20241022",
    "claude-3-5-haiku-20241022",
  ];

  let lastError = "";

  for (const model of models) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          system: systemPrompt,
          messages,
          stream: true,
        }),
      });

      if (response.ok) {
        return new Response(response.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      }

      const errText = await response.text();
      lastError = `${model}: ${response.status} - ${errText.substring(0, 300)}`;

      // Only retry on 404 (model not found), not on auth/rate errors
      if (response.status !== 404) {
        return NextResponse.json(
          { error: `API error (${model}): ${response.status}`, details: errText.substring(0, 500) },
          { status: response.status }
        );
      }
    } catch (fetchErr: any) {
      lastError = `${model}: fetch failed - ${fetchErr.message}`;
    }
  }

  return NextResponse.json(
    { error: "No compatible model found. Check your API key and credits.", details: lastError },
    { status: 500 }
  );
}
