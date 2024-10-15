import type { UUID } from "node:crypto";
import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export type GameStatus = "onsale" | "presale" | "active" | "inactive" | "cancelled" | "rescheduled" | "offsale";

export interface GameTable {
	id: Generated<UUID>;
	name: string;
	stadium_id: string;
	ticket_vendor_id: string;
	start_date: Date;
	end_date: Date;
	presale_date: Date | null;
	onsale_date: Date | null;
	offsale_date: Date | null;
	min_price: number | null;
	max_price: number | null;
	status: GameStatus;
	created_at: Generated<Date>;
	modified_at: ColumnType<Date, string, never>;
}

export type Game = Selectable<GameTable>;
export type InsertGame = Insertable<GameTable>;
export type UpdateGame = Updateable<GameTable>;
