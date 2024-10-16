import type { UUID } from "node:crypto";
import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface StadiumTable {
	id: Generated<UUID>;
	name: string;
	city: string;
	state: string;
	country: string;
	zipcode: string;
	address: string;
	timezone: string;
	lon: number;
	lat: number;
	created_at: Generated<Date>;
	modified_at: ColumnType<Date, string, never>;
}

export type Stadium = Selectable<StadiumTable>;
export type InsertStadium = Insertable<StadiumTable>;
export type UpdateStadium = Updateable<StadiumTable>;
