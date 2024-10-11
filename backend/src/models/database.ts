import type { Kysely } from "kysely";

import type { GameTable } from "@/models/game";
import type { GameTeamTable } from "@/models/gameTeam";
import type { StadiumTable } from "@/models/stadium";
import type { TeamTable } from "@/models/team";
import type { TicketVendorTable } from "@/models/ticketVendor";

export interface Database {
	ticket_vendors: TicketVendorTable;
	stadiums: StadiumTable;
	teams: TeamTable;
	games: GameTable;
	games_teams: GameTeamTable;
}

export type DBInstance = Kysely<Database>;
