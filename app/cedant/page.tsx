"use client";

import { Input } from "@/components/ui/input";
import { useChat } from "ai/react";

export default function Chat() {
	const { messages, input, handleInputChange, handleSubmit } = useChat();

	// Regrouper les messages par paires (utilisateur et IA)
	const groupedMessages = [];
	for (let i = 0; i < messages.length; i += 2) {
		groupedMessages.push(messages.slice(i, i + 2));
	}

	return (
		<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
			{groupedMessages.map((group, index) => (
				<div key={index} className="mb-4">
					{group.map((m) => (
						<div
							key={m.id}
							className={`whitespace-pre-wrap p-2 rounded ${
								m.role === "user"
									? "bg-gray-100 self-end ml-12 rounded-xl"
									: " self-start "
							}`}
						>
							{m.role === "user" ? "User: " : "Xlinks-AI: "}
							{m.content}
						</div>
					))}
				</div>
			))}

			<form onSubmit={handleSubmit}>
				<Input
					className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
					value={input}
					placeholder="Écrivez votre message..."
					onChange={handleInputChange}
				/>
			</form>
		</div>
	);
}
