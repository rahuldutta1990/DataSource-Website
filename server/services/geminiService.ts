import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured. Please ensure your API key is set in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface MapsGroundingRequest {
  prompt: string;
  latitude?: number;
  longitude?: number;
}

export interface PlaceReviewSnippet {
  snippet?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
}

export interface ExtractedMapChunk {
  title: string;
  uri: string;
  address?: string;
  placeAnswerSources?: {
    reviewSnippets?: PlaceReviewSnippet[];
  };
}

export interface MapsGroundingResult {
  text: string;
  mapsChunks: ExtractedMapChunk[];
  groundingMetadata: any;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  roleMode?: 'architect' | 'data' | 'fast_estimator';
}

export interface ChatResponse {
  text: string;
  modelUsed: string;
}

const SYSTEM_INSTRUCTIONS: Record<string, string> = {
  architect: `You are the Principal AI & Cloud Solutions Architect at DataSource (a premier enterprise technology and data consulting company).
Your mission is to provide high-level, production-grade architectural guidance, feasibility assessments, and technical strategy to CTOs, engineering directors, product managers, and enterprise decision-makers.

Key competencies:
- Custom Cloud & Web Applications (Microservices, Next.js, React, Node.js, Golang, Python, Serverless, Kubernetes).
- Cloud Migration & Modern DevOps (AWS, GCP, Azure, Terraform, CI/CD, Zero-Downtime rollouts).
- Enterprise Data Architecture & Engineering (Lakehouses, Snowflake, BigQuery, Databricks, Kafka, dbt).
- Power BI, Data Fabric, and Business Intelligence modernization.
- AI/LLM system integration (RAG, vector stores, Gemini API, AI Agents, enterprise governance).
- Legacy System Modernization and Technical Architecture Evaluations.

Guidelines:
- Deliver structured, actionable, and lucid technical advice. Use Markdown headings, bullet points, and code snippets where helpful.
- Reference DataSource's philosophy: "We start with your business goals, not pre-packaged software licenses."
- Never invent fake pricing or commitments; recommend booking an initial technical consultation with our engineering team or connecting on WhatsApp (+91 9038417437).`,

  data: `You are the Lead Data & BI Strategist at DataSource.
You specialize in modern data platforms, data warehousing, Power BI enterprise dashboards, DAX optimization, dimensional modeling (Kimball), ETL/ELT pipelines, and data governance.
Provide concrete technical solutions, schema recommendations, optimization strategies, and data pipeline best practices.
Encourage the user to request a DataSource Data Audit or connect with our data engineering team on WhatsApp (+91 9038417437).`,

  fast_estimator: `You are the Rapid Scoping & Estimation Advisor at DataSource.
You help clients quickly scope timelines, team composition, technology stacks, and approximate phases for web/cloud applications, data migrations, and BI overhauls.
Provide fast, high-level feasibility summaries, milestone breakdowns, and risk factors.
Always remind users that exact estimates require an initial consultation with a DataSource principal consultant.`
};

/**
 * Executes a multi-turn chat request using Gemini with conversation history and role system instruction.
 */
export async function chatWithGemini(req: ChatRequest): Promise<ChatResponse> {
  const ai = getGenAI();

  // Model selection hierarchy:
  // gemini-3.1-pro-preview for complex architecture
  // gemini-3.1-flash-lite for fast responses
  // gemini-3.5-flash for general tasks (default)
  let targetModel = req.model || 'gemini-3.5-flash';
  
  if (targetModel.startsWith('models/')) {
    targetModel = targetModel.replace('models/', '');
  }

  // Ensure valid model name
  const validModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.1-pro-preview', 'gemini-3.7-flash'];
  if (!validModels.includes(targetModel)) {
    targetModel = 'gemini-3.5-flash';
  }

  const roleMode = req.roleMode || 'architect';
  const systemInstruction = SYSTEM_INSTRUCTIONS[roleMode] || SYSTEM_INSTRUCTIONS.architect;

  // Format history contents
  const contents = req.messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  const response = await ai.models.generateContent({
    model: targetModel,
    contents,
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  const text = response.text || 'I analyzed your request, but was unable to produce a detailed response. Please refine your inquiry.';

  return {
    text,
    modelUsed: targetModel,
  };
}

/**
 * Executes a Maps Grounded query using gemini-3.5-flash and the googleMaps tool.
 * Extracts grounding chunks containing Maps URIs, titles, and review snippets.
 */
export async function queryWithGoogleMaps(req: MapsGroundingRequest): Promise<MapsGroundingResult> {
  const ai = getGenAI();

  const config: any = {
    tools: [{ googleMaps: {} }],
  };

  if (typeof req.latitude === 'number' && typeof req.longitude === 'number' && !isNaN(req.latitude) && !isNaN(req.longitude)) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: req.latitude,
          longitude: req.longitude,
        },
      },
    };
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: req.prompt,
    config,
  });

  const text = response.text || '';
  const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const mapsChunks: ExtractedMapChunk[] = [];

  for (const chunk of rawChunks) {
    if (chunk.maps) {
      const mapsData = chunk.maps as any;
      mapsChunks.push({
        title: mapsData.title || mapsData.name || 'Location on Google Maps',
        uri: mapsData.uri || (mapsData.placeId ? `https://www.google.com/maps/place/?q=place_id:${mapsData.placeId}` : 'https://maps.google.com'),
        address: mapsData.address || '',
        placeAnswerSources: mapsData.placeAnswerSources || undefined,
      });
    }
  }

  return {
    text,
    mapsChunks,
    groundingMetadata: response.candidates?.[0]?.groundingMetadata || null,
  };
}
