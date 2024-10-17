import type { UUID } from "node:crypto";
import type { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface TeamTable {
	id: Generated<UUID>;
	name: string;
	city: string;
	state: string;
	country: string;
}

export type Team = Selectable<TeamTable>;
export type InsertTeam = Insertable<TeamTable>;
export type UpdateTeam = Updateable<TeamTable>;
