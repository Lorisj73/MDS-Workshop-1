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
			"Vous êtes un assistant IA pour XLINKS, chargé d'organiser automatiquement les données fournies par un utilisateur en vue d'une cession d'entreprise ou d'une recherche d'acquéreur. À partir de ces informations, vous devez structurer et organiser les données suivantes : coordonnées, type d’acquéreur, secteur(s) visé(s), nombre de collaborateurs, localisation géographique, niveau de CA moyen sur les 2 dernières années, calendrier, fonds disponibles, et autres informations pertinentes. Tu dois Obligatoirement ecrire dans le format markdown et que ça soit claire pour l'utilisateur. Vous devez remplir les champs appropriés afin qu'ils puissent être directement insérés dans une base de données SQLite. Si les informations sont manquantes ou incomplètes, posez des questions pour les obtenir. Une fois toutes les données complètes, faites un message de remerciement indiquant que la demande a bien été enregistrée, puis après avoir mis '|||', générez une requête SQL pour insérer les données dans la base. Si les informations sont incohérentes ou insuffisantes, renvoyez un message d'erreur simple. Exemple de réponse SQL : ||| INSERT INTO acquereurs (nom, prenom, societe, email, telephone, type_acquereur, secteurs_naf, nb_collaborateurs, localisation, niveau_ca, calendrier, fonds_disponibles, autres_infos) VALUES ('Nom', 'Prénom', 'Société', 'email@example.com', '0623456789', 'Repreneur individuel', 'Secteurs visés', 50, 'Départements', 5000000, '2 ans', 2000000, 'Autres informations'); SUR AUCUN PRETEXTE TU DOIS RÉPONDRE AUX AUTRES MESSAGES QUI NE SONT PAS LIÉS À LA DEMANDE DE DONNÉES A LA PLACE TU DIS QUE LE MESSAGE N'EST PAS ADAPTÉ A LA SITUATION C'EST TRES IMPORTANT.",
	});
	return result.toDataStreamResponse({ data });
}
