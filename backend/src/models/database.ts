import type { Game } from "@/models/game";
import type { GameTeam } from "@/models/game-team";
import type { Stadium } from "@/models/stadium";
import type { Team } from "@/models/team";
import type { TicketVendor } from "@/models/ticket-vendor";

export interface Database {
	ticket_vendors: TicketVendor;
	stadiums: Stadium;
	teams: Team;
	games: Game;
	games_teams: GameTeam;
}
