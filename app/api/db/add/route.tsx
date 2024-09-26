import path from "node:path";
import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";

const dbPath = path.resolve(process.cwd(), "db", "base.db");

export async function POST(req: Request) {
	const data = await req.json();

	// Connexion à la base de données SQLite
	const db = new sqlite3.Database(dbPath, (err) => {
		if (err) {
			console.error("Erreur lors de l'ouverture de la base de données :", err);
			return NextResponse.json(
				{ error: "Erreur lors de l'ouverture de la base de données" },
				{ status: 500 },
			);
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
					console.error("Erreur lors de l'insertion des données :", err);
					reject(
						NextResponse.json(
							{ error: "Erreur lors de l'insertion des données" },
							{ status: 500 },
						),
					);
				} else {
					resolve(
						NextResponse.json(
							{ message: "Données insérées avec succès", id: this.lastID },
							{ status: 200 },
						),
					);
				}
			},
		);
	});
}
