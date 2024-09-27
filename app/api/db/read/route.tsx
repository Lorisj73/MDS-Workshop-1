import path from "node:path";
import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";

const dbPath = path.resolve(process.cwd(), "db", "base.db");

export async function GET(): Promise<Response> {
	// Spécifiez que la fonction retourne Promise<Response>
	return new Promise<Response>((resolve, reject) => {
		// Précisez ici que vous renvoyez une Promise<Response>
		// Connexion à la base de données SQLite
		const db = new sqlite3.Database(dbPath, (err) => {
			if (err) {
				console.error(
					"Erreur lors de l'ouverture de la base de données :",
					err,
				);
				return reject(
					NextResponse.json(
						{ error: "Erreur lors de l'ouverture de la base de données" },
						{ status: 500 },
					),
				);
			}
		});

		// Requête pour récupérer les données
		const sql = "SELECT * FROM acquereurs";

		db.all(sql, [], (err, rows) => {
			db.close(); // Fermer la base de données

			if (err) {
				console.error("Erreur lors de la récupération des données :", err);
				return reject(
					NextResponse.json(
						{ error: "Erreur lors de la récupération des données" },
						{ status: 500 },
					),
				);
			}

			// Si tout va bien, on renvoie les données
			resolve(NextResponse.json({ data: rows }, { status: 200 }));
		});
	});
}
