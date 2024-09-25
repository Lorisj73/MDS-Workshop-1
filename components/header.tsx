import { Button } from "@/components/ui/button";
import { Building2, Home, UserCircle, Users } from "lucide-react";
import Link from "next/link";

export default function Header() {
	return (
		<header className="bg-white shadow-md">
			<div className="flex justify-between items-center p-3">
				<Link href="/" className="flex items-center space-x-2">
					<span className="text-2xl font-bold">Xlinks</span>
				</Link>
				<nav className="flex space-x-4">
					<Link
						href="/"
						className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
					>
						<Home className="mr-3 h-6 w-6" />
						Home
					</Link>
					<Link
						href="/acquereur"
						className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
					>
						<Users className="mr-3 h-6 w-6" />
						Acquéreur
					</Link>
					<Link
						href="/cedant"
						className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
					>
						<Building2 className="mr-3 h-6 w-6" />
						Cédant
					</Link>
				</nav>
				<Button variant="outline" className="flex items-center">
					<UserCircle className="mr-2 h-5 w-5" />
					Profil
				</Button>
			</div>
		</header>
	);
}
