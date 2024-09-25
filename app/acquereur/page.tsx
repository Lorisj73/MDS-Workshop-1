import Chat from "@/components/chat";

export default function Acquereur() {
	return (
		<div className="p-6">
			<Chat apiUrl="/api/chat/acquereur" />
		</div>
	);
}
