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

	// Requête pour vérifier si l'email existe déjà
	const checkEmailSql = "SELECT email FROM acquereurs WHERE email = ?";

	return new Promise((resolve, reject) => {
		db.get(checkEmailSql, [data.email], (err, row) => {
			if (err) {
				db.close();
				console.error("Erreur lors de la vérification de l'email :", err);
				return reject(
					NextResponse.json(
						{ error: "Erreur lors de la vérification de l'email" },
						{ status: 500 },
					),
				);
			}

			if (row) {
				// Si l'email existe, mise à jour des données
				const updateSql = `
          UPDATE acquereurs
          SET nom = ?, prenom = ?, societe = ?, telephone = ?, type_acquereur = ?,
              code_naf = ?, nb_collaborateurs = ?, localisation = ?, niveau_ca = ?,
              calendrier = ?, fonds_disponibles = ?, autres_infos = ?
          WHERE email = ?
        `;

				db.run(
					updateSql,
					[
						data.nom,
						data.prenom,
						data.societe,
						data.telephone,
						data.type_acquereur,
						data.secteurs_vises,
						data.nb_collaborateurs,
						data.localisation,
						data.niveau_ca,
						data.calendrier,
						data.fonds_disponibles,
						data.autres_infos,
						data.email, // Utilisé pour identifier l'enregistrement à mettre à jour
					],
					(err) => {
						db.close(); // Fermer la base de données

						if (err) {
							console.error("Erreur lors de la mise à jour des données :", err);
							reject(
								NextResponse.json(
									{ error: "Erreur lors de la mise à jour des données" },
									{ status: 500 },
								),
							);
						} else {
							resolve(
								NextResponse.json(
									{ message: "Données mises à jour avec succès" },
									{ status: 200 },
								),
							);
						}
					},
				);
			} else {
				// Si l'email n'existe pas, insertion des données
				const insertSql = `
          INSERT INTO acquereurs (
            nom, prenom, societe, email, telephone, type_acquereur,
            code_naf, nb_collaborateurs, localisation,
            niveau_ca, calendrier, fonds_disponibles, autres_infos
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

				db.run(
					insertSql,
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
			}
		});
	});
}
