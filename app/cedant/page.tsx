import Chat from "@/components/chat";

export default function Cedant() {
	return (
		<div className="p-6">
			<Chat apiUrl="/api/chat/cedant" />
		</div>
	);
}
