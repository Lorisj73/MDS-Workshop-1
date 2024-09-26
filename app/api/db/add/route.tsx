import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";

export async function POST(req: Request) {
	const data = await req.json(); // Récupère le JSON envoyé par le client

	// Connexion à la base de données SQLite
	const db = new sqlite3.Database("./base.db", (err) => {
		if (err) {
			console.error("Erreur lors de l'ouverture de la base de données :", err);
		}
	});

	// Requête d'insertion SQL
	const sql = `
    INSERT INTO acquereurs (
      nom, prenom, societe, email, telephone, type_acquereur,
      code_naf, nb_collaborateurs, localisation,
      niveau_ca, calendrier, fonds_disponibles, autres_infos
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

	// Exécution de la requête d'insertion
	return new Promise((resolve, reject) => {
		db.run(
			sql,
			[
				data.nom,
				data.prenom,
				data.societe,
				data.email,
				data.telephone,
				data.type_acquereur,
				data.secteurs_vises,
				data.nb_collaborateurs,
				data.localisation,
				data.niveau_ca,
				data.calendrier,
				data.fonds_disponibles,
				data.autres_infos,
			],
			function (err) {
				db.close(); // Fermer la base de données

				if (err) {
					reject(
						new NextResponse(
							JSON.stringify({
								error: "Erreur lors de l'insertion des données",
							}),
							{ status: 500 },
						),
					);
				} else {
					resolve(
						new NextResponse(
							JSON.stringify({
								message: "Données insérées avec succès",
								id: this.lastID,
							}),
							{ status: 200 },
						),
					);
				}
			},
		);
	});
}
