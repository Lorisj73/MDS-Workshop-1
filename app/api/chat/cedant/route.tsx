import { createOpenAI } from "@ai-sdk/openai";
import { StreamData, convertToCoreMessages, streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();
	const data = new StreamData();
	data.append({ test: "value" });
	const groq = createOpenAI({
		baseURL: "https://api.groq.com/openai/v1",
		apiKey: process.env.GROQ_API_KEY,
	});

	const result = await streamText({
		model: groq("llama-3.1-70b-versatile"),
		messages: convertToCoreMessages(messages),
		onFinish() {
			data.close();
		},
		temperature: 0.7,
		system:
			"Vous êtes un assistant IA pour XLINKS, spécialisé dans l'aide aux cédants d'entreprises. Votre tâche est d'analyser les informations fournies sur l'entreprise à céder et de rechercher des acquéreurs potentiels dans la base de données qui sera envoyé avant le message.",
	});

	return result.toDataStreamResponse({ data });
}
