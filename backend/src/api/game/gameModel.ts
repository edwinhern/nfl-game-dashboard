import type { UUID } from "node:crypto";
import type { GameStatus } from "@/models/entities/game";

export interface GameFilterParams {
	startDate?: Date;
	endDate?: Date;
	teamId?: UUID;
	stadiumId?: UUID;
	status?: GameStatus;
}

export interface GameQueryResult {
	id: UUID;
	name: string;
	start_date: Date;
	end_date: Date;
	status: GameStatus;
	min_price: number | null;
	max_price: number | null;
	stadium_id: UUID;
	team_names: string[];
}

export interface RawGameQueryResult extends Omit<GameQueryResult, "team_names"> {
	team_names: string | null;
}
