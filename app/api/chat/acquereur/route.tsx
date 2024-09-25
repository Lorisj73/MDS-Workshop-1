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
			"Vous êtes un assistant IA pour XLINKS, chargé d'organiser automatiquement les données fournies par un utilisateur en vue d'une cession d'entreprise ou d'une recherche d'acquéreur. À partir de ces informations, vous devez structurer les données et remplir les champs appropriés tels que secteur d'activité, localisation, chiffre d'affaires, etc., afin qu'elles puissent être directement insérées dans une base de données. Vous pouvez poser des questions demandant des informations supplémentaires lorsqu'il manque des données. Une fois que vous avez toutes les données, Faites un message de remerciement et dites que vous avez bien enregistré la demande, puis après avoir mis les trois charactères suivants : '|||' vous ferez une entrée sqlite renseignant toutes les données entrées. ",
	});
	return result.toDataStreamResponse({ data });
}
