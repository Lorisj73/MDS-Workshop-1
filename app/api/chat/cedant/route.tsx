import { createOpenAI } from "@ai-sdk/openai";
import { StreamData, convertToCoreMessages, streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();
	const data = new StreamData();
	data.append({ test: "value" });

	// Étape 1 : Récupérer les données de l'API
	let acquereursData = [];
	try {
		const response = await fetch("http://localhost:3000/api/db/read");
		if (!response.ok) {
			throw new Error("Erreur lors de la récupération des données");
		}
		const result = await response.json();
		acquereursData = result.data; // Récupérer les données des acquéreurs
	} catch (error) {
		console.error("Erreur lors de la récupération des acquéreurs :", error);
	}

	// Étape 2 : Préparer les messages pour l'IA
	const groq = createOpenAI({
		baseURL: "https://api.groq.com/openai/v1",
		apiKey: process.env.GROQ_API_KEY,
	});

	// On ajoute les données des acquéreurs au message
	const augmentedMessages = [
		...messages,
		{
			role: "system",
			content: `Voici les acquéreurs potentiels : ${JSON.stringify(acquereursData)}`,
		},
	];

	const result = await streamText({
		model: groq("llama-3.1-70b-versatile"),
		messages: convertToCoreMessages(augmentedMessages),
		onFinish() {
			data.close();
		},
		temperature: 0.4,
		system:
			"Vous êtes un assistant IA pour XLINKS, spécialisé dans l'aide aux cédants d'entreprises. Votre tâche est d'analyser les informations fournies sur l'entreprise à céder et de rechercher des acquéreurs potentiels dans la base de données qui a été envoyée avant le message. Tu dois utiliser les infos que de la base de données et rien d'autres. Utilise le markdown pour une meilleur lisibilité. Si il y a des doublons mettre juste un *x.",
	});

	return result.toDataStreamResponse({ data });
}
