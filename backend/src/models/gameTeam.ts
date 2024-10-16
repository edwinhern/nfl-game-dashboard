import type { UUID } from "node:crypto";
import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface GameTeamTable {
	game_id: Generated<UUID>;
	team_id: Generated<UUID>;
}

export type GameTeam = Selectable<GameTeamTable>;
export type InsertGameTeam = Insertable<GameTeamTable>;
export type UpdateGameTeam = Updateable<GameTeamTable>;
