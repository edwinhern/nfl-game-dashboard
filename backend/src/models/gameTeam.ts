import type { UUID } from "node:crypto";
import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface GameTeamTable {
	game_id: Generated<UUID>;
	team_id: Generated<UUID>;
	created_at: Generated<Date>;
	modified_at: ColumnType<Date, string, never>;
}

export type GameTeam = Selectable<GameTeamTable>;
export type InsertGameTeam = Insertable<GameTeamTable>;
export type UpdateGameTeam = Updateable<GameTeamTable>;
