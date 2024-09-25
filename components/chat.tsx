"use client";

import { useChat } from "ai/react";
import { Maximize, Minimize } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { remark } from "remark";
import html from "remark-html";

interface ChatProps {
	apiUrl: string;
}

export default function Chat({ apiUrl }: ChatProps) {
	const { messages, input, handleInputChange, handleSubmit } = useChat({
		api: apiUrl,
	});
	const [formattedMessages, setFormattedMessages] = useState([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [isFullScreen, setIsFullScreen] = useState(false);

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

	const toggleFullScreen = () => {
		setIsFullScreen(!isFullScreen);
	};

	return (
		<div className="items-center justify-center flex flex-col min-h-screen bg-white text-gray-900">
			<div
				className={`flex flex-col py-20 mx-auto stretch ${isFullScreen ? "w-full max-w-none" : "w-full max-w-md"}`}
			>
				<div className="flex-grow overflow-y-auto mb-20">
					{formattedMessages.length === 0 ? (
						<div className="text-center text-gray-500">
							Aucun message pour le moment. Commencez à discuter !
						</div>
					) : (
						formattedMessages.map((m, index) => (
							<div key={index} className="mb-4">
								<div
									className={`whitespace-pre-wrap p-2 rounded ${
										m.role === "user"
											? "bg-gray-100 self-end ml-12 rounded-xl"
											: " self-start "
									}`}
								>
									{m.role === "user" ? "User: " : "Xlinks-AI: "}
									<div dangerouslySetInnerHTML={{ __html: m.htmlContent }} />
								</div>
							</div>
						))
					)}
					<div ref={messagesEndRef} />
				</div>
			</div>
			<form
				onSubmit={handleSubmit}
				className="fixed bottom-0 w-full max-w-xl p-4 mb-8 bg-[#f4f4f4] dark:bg-token-main-surface-secondary rounded-2xl flex items-center gap-2 border-0"
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
			<button
				onClick={toggleFullScreen}
				className="fixed bottom-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
			>
				{isFullScreen ? (
					<Minimize className="h-6 w-6" />
				) : (
					<Maximize className="h-6 w-6" />
				)}
			</button>
		</div>
	);
}
