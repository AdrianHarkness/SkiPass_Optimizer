import { GoogleGenAI, Type } from "@google/genai";
import { OptimizationResponse, PortfolioItem } from "../types";
import { PASS_PRICES, EPIC_DAY_PASS_PRICES, IKON_SESSION_PRICES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const optimizeSkiPlan = async (portfolio: PortfolioItem[]): Promise<OptimizationResponse> => {
  if (portfolio.length === 0) {
    throw new Error("Portfolio is empty");
  }

  const model = "gemini-2.5-flash";
  
  const portfolioDescription = portfolio
    .map(p => {
      const affiliations = (p.passAffiliation && p.passAffiliation.length > 0) 
        ? p.passAffiliation.join(', ') 
        : "None (Independent / Specific Pass Only)";
      return `- ${p.name} (${p.region}) [Passes: ${affiliations}] [Day Ticket Price: $${p.dayTicketPrice}]: ${p.days} days`;
    })
    .join('\n');

  const pricingContext = `
    2024/25 SEASON PASS PRICING (USD):
    - Epic Pass (Full): $${PASS_PRICES.epic.full}
    - Epic Local Pass: $${PASS_PRICES.epic.local} (Note: Check for blackouts/restrictions if applicable, but assume standard access for calculation unless days > 5 at partner resorts)
    - Ikon Pass (Full): $${PASS_PRICES.ikon.full}
    - Ikon Base Pass: $${PASS_PRICES.ikon.base}
    - Ikon Base Plus Pass: $${PASS_PRICES.ikon.basePlus}
    - Mountain Collective: $${PASS_PRICES.mountainCollective} (2 days at each resort, 50% off additional days)
    - Indy Pass Base: $${PASS_PRICES.indy.base} (2 days at each resort)

    MULTI-DAY PRODUCT PRICING (USD) - USE THESE INSTEAD OF WINDOW RATES IF CHEAPER:
    - Epic Day Pass (All Resorts): ${JSON.stringify(EPIC_DAY_PASS_PRICES)}
       * Key: Number of days -> Price. e.g. "4": 471 means a 4-Day pass is $471 total.
       * Valid at all Epic resorts.
    - Ikon Session Pass: ${JSON.stringify(IKON_SESSION_PRICES)}
       * Key: Number of days -> Price.
       * Valid at Select Ikon resorts (Steamboat, Winter Park, Copper, Palisades, Mammoth, etc. - check standard lists).
  `;

  const prompt = `
    You are a ski trip cost optimization expert.
    I am planning to ski at the following mountains this winter:
    
    ${portfolioDescription}

    REFERENCE PRICING DATA:
    ${pricingContext}

    IMPORTANT INSTRUCTIONS:
    1. **Pass Affiliations**: Trust the "Passes" list provided for each mountain explicitly.
    2. **Ticket Prices**: Trust the "Day Ticket Price" listed above explicitly for single day comparisons.
    3. **Exact Math**: 
       - Compare the cost of single day tickets vs. Multi-Day products vs. Season Passes.
       - If I am skiing 4 days at Vail ($299/day window rate = $1196), BUT a 4-Day Epic Day Pass is $471, you MUST recommend the Epic Day Pass.
       - If I am skiing 5 days at Vail and 5 days at Park City, that is 10 Epic days. Compare 10x Window Rates vs. Epic Local Pass ($${PASS_PRICES.epic.local}) vs 2x 5-Day Epic Day Passes.
       - Use the provided "Day Ticket Price" for any days not covered by a pass.
    4. **Independent Resorts**: For resorts listed as "None" (e.g. Whitefish), you must use their specific window rate or their specific pass if you know it, but generally assume window rate or independent pass. Whitefish is NOT on Mountain Collective.
    5. **Recommendation**: Provide the strategy with the lowest total numerical cost.

    Return ONLY strict JSON matching the schema. Do not output markdown code blocks.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommended: {
            type: Type.OBJECT,
            properties: {
              strategyName: { type: Type.STRING, description: "Short title of the strategy" },
              totalEstimatedCost: { type: Type.NUMBER },
              passCost: { type: Type.NUMBER, description: "Cost of the main passes involved" },
              ticketCost: { type: Type.NUMBER, description: "Cost of add-on day tickets" },
              savingsVsDayPasses: { type: Type.NUMBER, description: "Savings vs buying all window-rate tickets" },
              reasoning: { type: Type.STRING, description: "Explanation of why this is best, citing specific prices used." },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    description: { type: Type.STRING },
                    cost: { type: Type.NUMBER },
                    notes: { type: Type.STRING, nullable: true },
                  }
                }
              }
            }
          },
          alternatives: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                strategyName: { type: Type.STRING },
                totalEstimatedCost: { type: Type.NUMBER },
                passCost: { type: Type.NUMBER },
                ticketCost: { type: Type.NUMBER },
                savingsVsDayPasses: { type: Type.NUMBER },
                reasoning: { type: Type.STRING },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      description: { type: Type.STRING },
                      cost: { type: Type.NUMBER },
                      notes: { type: Type.STRING, nullable: true },
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  try {
    let jsonString = response.text.trim();
    
    // Find the first '{' and last '}' to extract the JSON object, 
    // ignoring any markdown code blocks or preamble text.
    const firstBrace = jsonString.indexOf('{');
    const lastBrace = jsonString.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonString = jsonString.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(jsonString) as OptimizationResponse;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    console.debug("Raw Response:", response.text);
    throw new Error("Failed to parse optimization results. The AI model might have returned an invalid format.");
  }
};
