import type { DBInstance } from "@/models/database";
import type { Game, InsertGame } from "@/models/game";

export async function upsertGame(db: DBInstance, game: InsertGame): Promise<void> {
	await db
		.insertInto("games")
		.values(game)
		.onConflict((oc) => oc.column("id").doNothing())
		.execute();
}

export async function findByName(db: DBInstance, name: string): Promise<Game | undefined> {
	return db.selectFrom("games").selectAll().where("name", "=", name).executeTakeFirst();
}
