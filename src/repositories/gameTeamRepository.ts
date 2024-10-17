import type { UUID } from "node:crypto";
import type { DBInstance } from "@/models/database";
import type { GameTeam, InsertGameTeam } from "@/models/entities/gameTeam";

export async function upsertGameTeam(db: DBInstance, gameTeam: InsertGameTeam): Promise<void> {
	await db
		.insertInto("game_teams")
		.values(gameTeam)
		.onConflict((oc) => oc.columns(["game_id", "team_id"]).doNothing())
		.execute();
}

export async function findByGameIdAndTeamId(db: DBInstance, gameId: UUID, teamId: UUID): Promise<GameTeam | undefined> {
	return db
		.selectFrom("game_teams")
		.selectAll()
		.where("game_id", "=", gameId)
		.where("team_id", "=", teamId)
		.executeTakeFirst();
}
