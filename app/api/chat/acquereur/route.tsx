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
		system: "Tu agiras comme une personne qui parle français",
	});
	return result.toDataStreamResponse({ data });
}
