import type { DBInstance } from "@/models/database";
import type { Game, InsertGame } from "@/models/entities/game";

export async function upsertGame(db: DBInstance, game: InsertGame): Promise<Game | undefined> {
	return await db
		.insertInto("games")
		.values(game)
		.onConflict((oc) =>
			oc.column("event_id").doUpdateSet({
				name: game.name,
				start_date: game.start_date,
				end_date: game.end_date,
				status: game.status,
				min_price: game.min_price,
				max_price: game.max_price,
				presale_date: game.presale_date,
				onsale_date: game.onsale_date,
				offsale_date: game.offsale_date,
				updated_at: new Date(),
			}),
		)
		.returningAll()
		.executeTakeFirst();
}

export async function findByName(db: DBInstance, name: string): Promise<Game | undefined> {
	return db.selectFrom("games").selectAll().where("name", "=", name).executeTakeFirst();
}

export async function findByEventId(db: DBInstance, eventId: string): Promise<Game | undefined> {
	return db.selectFrom("games").selectAll().where("event_id", "=", eventId).executeTakeFirst();
}
