import type { UUID } from "node:crypto";
import type { GameFilterParams, GameQueryResult } from "@/api/game";
import type { DBInstance } from "@/models/database";
import type { Game, GameStatus, InsertGame } from "@/models/entities/game";

const GAME_FIELDS = [
	"games.id",
	"games.name",
	"games.start_date",
	"games.end_date",
	"games.status",
	"games.min_price",
	"games.max_price",
	"games.stadium_id",
] as const;

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

export async function queryGames(db: DBInstance, filter: GameFilterParams): Promise<GameQueryResult[]> {
	// From and Join Clause
	let query = db
		.selectFrom("games")
		.leftJoin("game_teams", "games.id", "game_teams.game_id")
		.leftJoin("teams", "game_teams.team_id", "teams.id");

	// Apply filters to query (Where clause)
	if (filter.startDate) query = query.where("games.start_date", ">=", filter.startDate);
	if (filter.endDate) query = query.where("games.end_date", "<=", filter.endDate);
	if (filter.teamId) {
		query = query.where((eb) =>
			eb.exists(
				eb
					.selectFrom("game_teams as gt")
					.select("gt.game_id")
					.whereRef("gt.game_id", "=", "games.id")
					.where("gt.team_id", "=", filter.teamId as UUID),
			),
		);
	}
	if (filter.stadiumId) query = query.where("games.stadium_id", "=", filter.stadiumId as UUID);
	if (filter.status) query = query.where("games.status", "=", filter.status as GameStatus);

	// Group by Clause
	query = query.groupBy("games.id");

	// Select clause (include array_agg)
	query = query.select(GAME_FIELDS).select((eb) => eb.fn.agg("array_agg", [eb.ref("teams.name")]).as("team_names"));

	return (await query.execute()) as GameQueryResult[];
}
