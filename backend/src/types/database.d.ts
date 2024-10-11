import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface Database {
	ticket_vendors: TicketVendorTable;
	stadiums: StadiumTable;
	teams: TeamTable;
	games: GameTable;
	game_teams: GameTeamTable;
}

interface TicketVendorTable {
	id: Generated<string>;
	name: string;
	external_id: string | null;
}

interface StadiumTable {
	id: Generated<string>;
	name: string;
	city: string;
	state: string;
	country: string;
	zipcode: string;
	address: string;
	timezone: string;
	lon: number;
	lat: number;
	external_id: string | null;
}

interface TeamTable {
	id: Generated<string>;
	name: string;
	city: string;
	state: string;
	country: string;
	external_id: string | null;
}

type GameStatus = "onsale" | "presale" | "active" | "inactive" | "cancelled" | "rescheduled" | "offsale";

interface GameTable {
	id: Generated<string>;
	name: string;
	stadium_id: string;
	ticket_vendor_id: string;
	start_date: ColumnType<Date, string | Date, string | Date>;
	end_date: ColumnType<Date, string | Date, string | Date>;
	presale_date: ColumnType<Date, string | Date, string | Date> | null;
	onsale_date: ColumnType<Date, string | Date, string | Date> | null;
	offsale_date: ColumnType<Date, string | Date, string | Date> | null;
	min_price: number | null;
	max_price: number | null;
	status: GameStatus;
	external_id: string | null;
}

interface GameTeamTable {
	game_id: string;
	team_id: string;
}

// Utility types for CRUD operations
export type InsertableTicketVendor = Insertable<TicketVendorTable>;
export type SelectableTicketVendor = Selectable<TicketVendorTable>;
export type UpdateableTicketVendor = Updateable<TicketVendorTable>;

export type InsertableStadium = Insertable<StadiumTable>;
export type SelectableStadium = Selectable<StadiumTable>;
export type UpdateableStadium = Updateable<StadiumTable>;

export type InsertableTeam = Insertable<TeamTable>;
export type SelectableTeam = Selectable<TeamTable>;
export type UpdateableTeam = Updateable<TeamTable>;

export type InsertableGame = Insertable<GameTable>;
export type SelectableGame = Selectable<GameTable>;
export type UpdateableGame = Updateable<GameTable>;

export type InsertableGameTeam = Insertable<GameTeamTable>;
export type SelectableGameTeam = Selectable<GameTeamTable>;
export type UpdateableGameTeam = Updateable<GameTeamTable>;
