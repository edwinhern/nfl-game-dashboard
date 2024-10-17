import type { Kysely } from "kysely";

import type { GameTable } from "@/models/entities/game";
import type { GameTeamTable } from "@/models/entities/gameTeam";
import type { StadiumTable } from "@/models/entities/stadium";
import type { TeamTable } from "@/models/entities/team";
import type { TicketVendorTable } from "@/models/entities/ticketVendor";

export interface DatabaseTable {
	ticket_vendors: TicketVendorTable;
	stadiums: StadiumTable;
	teams: TeamTable;
	games: GameTable;
	game_teams: GameTeamTable;
}

export type DBInstance = Kysely<DatabaseTable>;
