"use client";

import { ArrowRight, BarChart, Building, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener("mousemove", handleMouseMove);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return (
		<div className="min-h-screen bg-white text-gray-900 flex flex-col relative overflow-hidden pt-16">
			{" "}
			{/* Added pt-16 to account for header height */}
			{/* Subtle background animation */}
			<div
				className="absolute inset-0 opacity-40"
				style={{
					background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 50%)`,
					transition: "background 0.3s ease",
				}}
			/>
			<main className="flex-grow flex items-center z-0">
				{" "}
				{/* Changed z-10 to z-0 */}
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-gray-900">
						{/* eslint-disable-next-line react/no-unescaped-entities */}
						Facilitez vos transactions d'entreprises
					</h2>
					<p className="text-xl mb-8 text-gray-700">
						{/* eslint-disable-next-line react/no-unescaped-entities */}
						WEXLINKS est un cabinet de conseil en transmission d'entreprise
						(M&A) leader sur le marché des TPE et PME en France.
					</p>
					<div className="flex justify-center space-x-4 mb-12">
						<Link
							href="/cedant"
							className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
						>
							Je suis cédant
							<ArrowRight className="ml-2 h-5 w-5" />
						</Link>
						<Link
							href="/acquereur"
							className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100 transition-colors"
						>
							Je suis acquéreur
							<ArrowRight className="ml-2 h-5 w-5" />
						</Link>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
							<Building className="h-12 w-12 text-gray-900 mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-2">WEXLINKS.FR</h3>
							<p className="text-gray-600">
								Cabinet de M&A, acteur de référence en France de la
								{/* eslint-disable-next-line react/no-unescaped-entities */}
								transmission d'entreprises
							</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
							<Users className="h-12 w-12 text-gray-900 mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-2">XLINKS.FR</h3>
							<p className="text-gray-600">
								{/* eslint-disable-next-line react/no-unescaped-entities */}
								La newsletter de la cession d'entreprises. 12 456 repreneurs
								enregistrés !
							</p>
						</div>
						<div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
							<BarChart className="h-12 w-12 text-gray-900 mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-2">XVAL.FR</h3>
							<p className="text-gray-600">
								1er cabinet de valorisation en France. + de 1500 dossiers
								accompagnés par an
							</p>
						</div>
					</div>
				</div>
			</main>
			<footer className="py-4 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-200 z-0">
				{" "}
				{/* Changed z-10 to z-0 */}
				<div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
					© {new Date().getFullYear()} WEXLINKS. Tous droits réservés.
				</div>
			</footer>
		</div>
	);
}
