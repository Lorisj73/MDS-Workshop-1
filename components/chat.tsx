"use client";

import { useChat } from "ai/react";
import { useRef, useEffect } from "react";

interface ChatProps {
  apiUrl: string;
}

export default function Chat({ apiUrl }: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: apiUrl,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const groupedMessages = [];
  for (let i = 0; i < messages.length; i += 2) {
    groupedMessages.push(messages.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col w-full max-w-md py-20 mx-auto stretch">
      <div className="flex-grow overflow-y-auto mb-20">
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
        <div ref={messagesEndRef} />
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
    </div>
  );
}