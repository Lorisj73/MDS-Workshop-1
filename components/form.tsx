"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function FormulaireAcquereur() {
	const [formData, setFormData] = useState({
		nom: "",
		prenom: "",
		societe: "",
		email: "",
		telephone: "",
		typeAcquereur: "",
		secteurActivite: "",
		nombreCollaborateurs: "",
		localisation: "",
		chiffreAffaires: "",
		calendrier: "",
		fondsDisponibles: "",
		autresInformations: "",
	});

	const handleChange = (e: a) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSelectChange = (name, value) => {
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(formData);
		// Ici, vous pouvez ajouter la logique pour envoyer les données à votre backend
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6 max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg"
		>
			<h1 className="text-2xl font-bold mb-6">
				Formulaire de recherche d'acquisition
			</h1>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Coordonnées de l'acquéreur</h2>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label htmlFor="nom">Nom</Label>
						<Input
							id="nom"
							name="nom"
							value={formData.nom}
							onChange={handleChange}
							required
						/>
					</div>
					<div>
						<Label htmlFor="prenom">Prénom</Label>
						<Input
							id="prenom"
							name="prenom"
							value={formData.prenom}
							onChange={handleChange}
							required
						/>
					</div>
				</div>
				<div>
					<Label htmlFor="societe">Société</Label>
					<Input
						id="societe"
						name="societe"
						value={formData.societe}
						onChange={handleChange}
					/>
				</div>
				<div>
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<Label htmlFor="telephone">Téléphone</Label>
					<Input
						id="telephone"
						name="telephone"
						type="tel"
						value={formData.telephone}
						onChange={handleChange}
						required
					/>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Type d'acquéreur</h2>
				<Select
					name="typeAcquereur"
					onValueChange={(value) => handleSelectChange("typeAcquereur", value)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Sélectionnez le type d'acquéreur" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="individuel">Repreneur individuel</SelectItem>
						<SelectItem value="entreprise">Entreprise</SelectItem>
						<SelectItem value="fonds">Fonds d'investissement</SelectItem>
						<SelectItem value="autre">Autre</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Cible recherchée</h2>
				<div>
					<Label htmlFor="secteurActivite">
						Secteurs d'activité (code NAF)
					</Label>
					<Input
						id="secteurActivite"
						name="secteurActivite"
						value={formData.secteurActivite}
						onChange={handleChange}
						placeholder="Ex: 62.01Z, 70.22Z"
					/>
				</div>
				<div>
					<Label htmlFor="nombreCollaborateurs">Nombre de collaborateurs</Label>
					<Input
						id="nombreCollaborateurs"
						name="nombreCollaborateurs"
						type="number"
						value={formData.nombreCollaborateurs}
						onChange={handleChange}
					/>
				</div>
				<div>
					<Label htmlFor="localisation">
						Localisations géographiques (départements)
					</Label>
					<Input
						id="localisation"
						name="localisation"
						value={formData.localisation}
						onChange={handleChange}
						placeholder="Ex: 75, 92, 93"
					/>
				</div>
				<div>
					<Label htmlFor="chiffreAffaires">
						Niveau moyen de CA sur les 2 dernières années (€)
					</Label>
					<Input
						id="chiffreAffaires"
						name="chiffreAffaires"
						type="number"
						value={formData.chiffreAffaires}
						onChange={handleChange}
					/>
				</div>
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Informations complémentaires</h2>
				<div>
					<Label htmlFor="calendrier">Calendrier prévisionnel</Label>
					<Input
						id="calendrier"
						name="calendrier"
						value={formData.calendrier}
						onChange={handleChange}
						placeholder="Ex: Q3 2024"
					/>
				</div>
				<div>
					<Label htmlFor="fondsDisponibles">
						Fonds disponibles pour l'acquisition (€)
					</Label>
					<Input
						id="fondsDisponibles"
						name="fondsDisponibles"
						type="number"
						value={formData.fondsDisponibles}
						onChange={handleChange}
					/>
				</div>
				<div>
					<Label htmlFor="autresInformations">Autres éléments importants</Label>
					<Textarea
						id="autresInformations"
						name="autresInformations"
						value={formData.autresInformations}
						onChange={handleChange}
						placeholder="Ajoutez ici toute information complémentaire pertinente pour votre recherche"
					/>
				</div>
			</div>

			<Button type="submit" className="w-full">
				Soumettre la recherche
			</Button>
		</form>
	);
}
