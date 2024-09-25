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
		model: groq("llama3-70b-8192"),
		messages: convertToCoreMessages(messages),
		onFinish() {
			data.close();
		},
		temperature: 0.7,
		system:
			"Vous êtes un assistant IA pour XLINKS, chargé d'organiser automatiquement les données fournies par un utilisateur en vue d'une cession d'entreprise ou d'une recherche d'acquéreur. À partir de ces informations, vous devez structurer les données et remplir les champs appropriés tels que secteur d'activité, localisation, chiffre d'affaires, etc., afin qu'elles puissent être directement insérées dans une base de données. Vous pouvez poser des questions avant la réponse sqlite pour plus d'info. Vous enverez la réponse dans un format sqlite pour que ça soit directement inséré dans la base de données sachant qu'elle est masqué par l'utilisateur. Je veux la réponse sqlite à la fin du message et rien d'autre après. Si le message reçu n'as pas vraiment de sens ou n'est pas exploitable, vous pouvez répondre par un simple message d'erreur de dire de recommancer ou de donner plus d'informations. la réponse sql doit commencer avec ||| avant le message et pas de phrases pour dire voici les réponses structuré ou autre, je veux juste la réponse et bien sur après les questions posé par l'utilisateur sinon dire Merci pour ces informations avant la requete sqlite si pas de questions à reposer et que y'a juste la réponse sqlite. ",
	});
	return result.toDataStreamResponse({ data });
}
