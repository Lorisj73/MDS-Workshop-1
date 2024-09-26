"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { remark } from "remark";
import html from "remark-html";

interface ChatProps {
  apiUrl: string;
  tab: boolean;
}

interface TableData {
  label: string;
  value: string;
  key: string;
}

export default function Chat({ apiUrl, tab }: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: apiUrl,
  });
  const [formattedMessages, setFormattedMessages] = useState([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [tableData, setTableData] = useState<TableData[]>([
    { label: "Nom", value: "", key: "nom" },
    { label: "Prénom", value: "", key: "prenom" },
    { label: "Société", value: "", key: "societe" },
    { label: "Email", value: "", key: "email" },
    { label: "Téléphone", value: "", key: "telephone" },
    { label: "Type d'acquéreur", value: "", key: "type_acquereur" },
    { label: "Code NAF", value: "", key: "code_naf" },
    { label: "Nombre de collaborateurs", value: "", key: "nb_collaborateurs" },
    { label: "Localisation", value: "", key: "localisation" },
    { label: "Chiffre d'affaires moyen (2 dernières années)", value: "", key: "niveau_ca" },
    { label: "Calendrier", value: "", key: "calendrier" },
    { label: "Fonds disponibles", value: "", key: "fonds_disponibles" },
    { label: "Autres infos", value: "", key: "autres_infos" },
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

            // Update the table data
            setTableData(prevData => 
              prevData.map(item => ({
                ...item,
                value: data[item.key] !== undefined ? String(data[item.key]) : item.value
              }))
            );

            // Send data to the database
            await fetch("/api/db/add", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });

            console.log("Données envoyées avec succès et tableau mis à jour :", data);
          } catch (error) {
            console.error("Erreur lors de l'analyse des données JSON :", error);
          }
        }
      }
    };

    processMessages();
  }, [messages]);

  return (
    <div className="flex items-start justify-center min-h-screen bg-white text-gray-900">
      <div
        className={`flex flex-col py-20 ${tab ? "w-2/3" : "w-full max-w-4xl"}`}
      >
        <div className="flex-grow overflow-y-auto mb-20 max-h-[calc(100vh-200px)]">
          {formattedMessages.length === 0 ? (
            <div className="text-center text-gray-500">
              Aucun message pour le moment. Commencez à discuter !
            </div>
          ) : (
            formattedMessages.map((m, index) => (
              <div key={index} className="mb-4">
                <div
                  className={`whitespace-pre-wrap chatbox-msg p-2 rounded ${
                    m.role === "user"
                      ? "bg-gray-100 self-end ml-12 rounded-xl"
                      : "self-start"
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
        <div
          className={`fixed bottom-0 ${
            tab ? "left-[15%]" : "left-1/2 transform -translate-x-1/2"
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
      {tab && (
        <div className={"py-20 w-1/3"}>
          <div className="bg-white shadow-md rounded-lg overflow-hidden mx-4">
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
                    <td className="px-4 py-2 font-medium">{item.label}</td>
                    <td className="px-4 py-2">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}