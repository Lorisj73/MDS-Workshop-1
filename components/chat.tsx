"use client";

import type { Attachment, ToolInvocation } from "ai";
import { useChat } from "ai/react";
import { Pencil, Save, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { remark } from "remark";
import html from "remark-html";
import { Button } from "./ui/button";

interface ChatProps {
	apiUrl: string;
	tab: boolean;
}

interface TableData {
	label: string;
	value: string;
	key: string;
	required: boolean;
}

export default function Chat({ apiUrl, tab }: ChatProps) {
	const { messages, input, handleInputChange, handleSubmit } = useChat({
		api: apiUrl,
	});
	interface FormattedMessage {
		role: string;
		htmlContent: string;
		id: string;
		createdAt?: Date;
		content: string;
		experimental_attachments?: Attachment[];
		tool_call_id?: string;
		ui?: string | JSX.Element | JSX.Element[] | null;
		toolInvocations?: ToolInvocation[];
	}

	const [formattedMessages, setFormattedMessages] = useState<
		FormattedMessage[]
	>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [isEditing, setIsEditing] = useState(false); // État pour gérer le mode d'édition
	const [tableData, setTableData] = useState<TableData[]>([
		{ label: "Nom", value: "", key: "nom", required: true },
		{ label: "Prénom", value: "", key: "prenom", required: true },
		{ label: "Société", value: "", key: "societe", required: false },
		{ label: "Email", value: "", key: "email", required: true },
		{ label: "Téléphone", value: "", key: "telephone", required: true },
		{
			label: "Type d'acquéreur",
			value: "",
			key: "type_acquereur",
			required: false,
		},
		{ label: "Code NAF", value: "", key: "code_naf", required: false },
		{
			label: "Nombre de collaborateurs",
			value: "",
			key: "nb_collaborateurs",
			required: false,
		},
		{ label: "Localisation", value: "", key: "localisation", required: false },
		{
			label: "Chiffre d'affaires moyen (2 dernières années)",
			value: "",
			key: "niveau_ca",
			required: false,
		},
		{ label: "Calendrier", value: "", key: "calendrier", required: false },
		{
			label: "Fonds disponibles",
			value: "",
			key: "fonds_disponibles",
			required: false,
		},
		{ label: "Autres infos", value: "", key: "autres_infos", required: false },
	]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();

		const processMessages = async () => {
			const newFormattedMessages = await Promise.all(
				messages.map(async (m) => {
					const processedContent = await remark().use(html).process(m.content);
					return {
						...m,
						htmlContent: processedContent.toString(),
					};
				}),
			);
			setFormattedMessages(newFormattedMessages);
		};

		processMessages();
	}, [messages]);

	useEffect(() => {
		const processMessages = async () => {
			const lastMessage = messages[messages.length - 1];

			if (lastMessage && lastMessage.role === "assistant") {
				const parts = lastMessage.content.split("|||");

				if (parts.length > 1) {
					const jsonPart = parts[1].trim();

					try {
						const data = JSON.parse(jsonPart);

						const newTableData = tableData.map((item) => ({
							...item,
							value:
								data[item.key] !== undefined
									? String(data[item.key])
									: item.value,
						}));

						setTableData(newTableData);
					} catch (error) {
						console.error("Erreur lors de l'analyse des données JSON :", error);
					}
				}
			}
		};

		processMessages();
	}, [messages]);

	const isFormValid = () => {
		return tableData.every(
			(item) => !item.required || item.value.trim() !== "",
		);
	};

	const handleSave = async () => {
		if (!isFormValid()) {
			alert("Veuillez remplir tous les champs obligatoires.");
			return;
		}

		const dataToSend = tableData.reduce(
			(acc: { [key: string]: string }, item) => {
				acc[item.key] = item.value;
				return acc;
			},
			{},
		);

		try {
			const response = await fetch("/api/db/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(dataToSend),
			});

			if (response.ok) {
				alert("Données enregistrées avec succès !");
			} else {
				throw new Error("Erreur lors de l'envoi des données");
			}
		} catch (error) {
			console.error("Erreur lors de l'envoi des données :", error);
			alert("Erreur lors de l'enregistrement des données.");
		}
	};

	// Fonction pour gérer le changement de valeur dans les champs d'entrée
	const handleInputChangeTable = (key: string, value: string) => {
		setTableData((prevData) =>
			prevData.map((item) => (item.key === key ? { ...item, value } : item)),
		);
	};

	const handleDelete = () => {
		if (
			window.confirm("Êtes-vous sûr de vouloir effacer toutes les données ?")
		) {
			// Réinitialise les données du tableau
			setTableData((prevData) =>
				prevData.map((item) => ({ ...item, value: "" })),
			);
			alert("Les données ont été effacées.");
		}
	};

	return (
		<div className="flex flex-col md:flex-row items-start justify-center min-h-screen bg-white text-gray-900">
			<div
				className={`flex flex-col py-20 w-full ${tab ? "md:w-2/3" : "max-w-4xl"}`}
			>
				{/* Chat messages */}
				<div className="flex-grow overflow-y-auto mb-20 max-h-[calc(100vh-200px)] px-4">
					{formattedMessages.map((m, index) => {
						const contentWithoutJSON = m.htmlContent.split("|||")[0].trim();

						return (
							<div key={index} className="mb-4">
								<div
									className={`whitespace-pre-wrap chatbox-msg p-2 rounded ${
										m.role === "user"
											? "bg-gray-100 self-end ml-12 rounded-xl"
											: "self-start"
									}`}
								>
									{m.role === "user" ? "User: " : "Xlinks-AI: "}
									<div
										dangerouslySetInnerHTML={{ __html: contentWithoutJSON }}
									/>
								</div>
							</div>
						);
					})}
					<div ref={messagesEndRef} />
				</div>

				{/* Input form */}
				<div
					className={`fixed bottom-0 ${
						tab ? "left-[18%]" : "left-1/2 transform -translate-x-1/2"
					} w-2/3 max-w-3xl mb-8`}
				>
					<form
						onSubmit={handleSubmit}
						className="w-full p-4 bg-[#f4f4f4] dark:bg-token-main-surface-secondary rounded-2xl flex items-center gap-2 border-0"
					>
						<input
							className="flex-grow p-2 border-0 bg-transparent text-lg resize-none focus:outline-none"
							value={input}
							placeholder="Écrivez votre message..."
							onChange={handleInputChange}
						/>
						<button
							type="submit"
							className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-500 text-white transition-colors hover:opacity-70 focus:outline-none"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="h-6 w-6"
							>
								<line x1="12" y1="19" x2="12" y2="5" />
								<polyline points="5 12 12 5 19 12" />
							</svg>
						</button>
					</form>
				</div>
			</div>

			{/* Table and Save button */}
			{tab && (
				<div className="w-full md:w-1/3 py-20 px-4">
					<div className="bg-white shadow-md rounded-lg overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="bg-gray-100">
									<th className="px-4 py-2 text-left">Champ</th>
									<th className="px-4 py-2 text-left">Valeur</th>
								</tr>
							</thead>
							<tbody>
								{tableData.map((item, index) => (
									<tr
										key={index}
										className={index % 2 === 0 ? "bg-gray-50" : ""}
									>
										<td className="px-4 py-2 font-medium">
											{item.label}
											{item.required && <span className="text-red-500">*</span>}
										</td>
										<td className="px-4 py-2">
											{isEditing ? (
												<input
													type="text"
													value={item.value}
													onChange={(e) =>
														handleInputChangeTable(item.key, e.target.value)
													}
													className="border border-gray-300 p-1 rounded"
												/>
											) : (
												<span>{item.value || "N/A"}</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className="p-4 flex justify-between">
							<Button
								onClick={() => setIsEditing((prev) => !prev)}
								variant={"secondary"}
							>
								{isEditing ? (
									<Save className="mr-2" />
								) : (
									<Pencil className="mr-2" />
								)}
								{isEditing ? "Enregistrer" : "Modifier"}
							</Button>
							{!isEditing && (
								<Button onClick={handleSave}>
									<Save className="mr-2" />
									Enregistrer
								</Button>
							)}
							<Button
								className="flex gap-2"
								variant="destructive"
								onClick={handleDelete}
							>
								<Trash2 className="w-4 h-4" />
								Effacer
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
