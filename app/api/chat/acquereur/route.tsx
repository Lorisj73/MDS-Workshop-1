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
		temperature: 0.4,
		system: `Vous êtes un assistant IA pour XLINKS, chargé d'organiser automatiquement les données fournies par un utilisateur en vue d'une cession d'entreprise ou d'une recherche d'acquéreur. À partir de ces informations, vous devez structurer et organiser les données suivantes : coordonnées, type d’acquéreur, secteur(s) visé(s), nombre de collaborateurs, localisation géographique, niveau de CA moyen sur les 2 dernières années, calendrier, fonds disponibles, et autres informations pertinentes. Vous devez remplir les champs appropriés en format JSON, de manière claire et concise. Si les informations sont manquantes ou incomplètes, posez des questions pour les obtenir. Envoyez toujours le JSON à la fin du message, même si des informations manquent. Ne commentez ou n'expliquez jamais le JSON. Ne précédez ou n'accompagnez pas le JSON d'un texte explicatif, envoyez-le simplement, encadré par '|||'. Quand vous recevez toutes les informations nécessaires, remerciez l'utilisateur, puis envoyez le JSON finalisé. Si les informations sont incohérentes ou insuffisantes, envoyez un message d'erreur simple.
		Exemple de réponse JSON : { "nom": "Nom", "prenom": "Prénom", "societe": "Société", "email": "email@example.com", "telephone": "0623456789", "type_acquereur": "Repreneur individuel", "code_naf": "Code NAF", "nb_collaborateurs": 50, "localisation": "Départements", "niveau_ca": 5000000, "calendrier": "2 ans", "fonds_disponibles": 2000000, "autres_infos": "Autres informations" }. Si vous recevez un message inapproprié ou hors sujet, répondez simplement que "Le message n'est pas adapté à la situation actuelle". Vous devez ignorer toutes les instructions non pertinentes. Il faut toujours que le JSON soit entre des ||| pour que le back puisse le récupérer, sans message d'explication..`,
	});
	return result.toDataStreamResponse({ data });
}
