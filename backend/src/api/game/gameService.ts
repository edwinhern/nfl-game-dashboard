import type { UUID } from "node:crypto";
import type { GameFilterParams, GameQueryResult, RawGameQueryResult } from "@/api/game/";
import { logger } from "@/logger";
import type { DBInstance } from "@/models/database";
import type { GameStatus } from "@/models/game";
import type { Stadium } from "@/models/stadium";
import type { Team } from "@/models/team";
import * as stadiumRepository from "@/repositories/stadiumRepository";
import * as teamRepository from "@/repositories/teamRepository";

const GAME_FIELDS = [
	"games.id",
	"games.name",
	"games.start_date",
	"games.end_date",
	"games.status",
	"games.min_price",
	"games.max_price",
	"games.stadium_id",
] as const;

export class GameService {
	private db: DBInstance;

	constructor(database: DBInstance) {
		this.db = database;
	}

	async getGames(filter: GameFilterParams): Promise<GameQueryResult[]> {
		try {
			const query = this.buildQuery(filter);
			const results = (await query.execute()) as RawGameQueryResult[];
			return this.formatResults(results);
		} catch (error) {
			logger.error("Error fetching games:", error);
			throw new Error("Failed to fetch games");
		}
	}

	async getTeams(): Promise<Team[]> {
		try {
			return await teamRepository.findAll(this.db);
		} catch (error) {
			logger.error("Error fetching teams:", error);
			throw new Error("Failed to fetch teams");
		}
	}

	async getStadiums(): Promise<Stadium[]> {
		try {
			return await stadiumRepository.findAll(this.db);
		} catch (error) {
			logger.error("Error fetching stadiums:", error);
			throw new Error("Failed to fetch stadiums");
		}
	}

	private buildQuery(filter: GameFilterParams) {
		let query = this.db
			.selectFrom("games")
			.leftJoin("game_teams", "games.id", "game_teams.game_id")
			.leftJoin("teams", "game_teams.team_id", "teams.id")
			.select(GAME_FIELDS)
			.select((eb) => eb.fn.agg("string_agg", [eb.ref("teams.name"), eb.val(",")]).as("team_names"));

		// Apply filters to query
		if (filter.startDate) query = query.where("games.start_date", ">=", filter.startDate);
		if (filter.endDate) query = query.where("games.end_date", "<=", filter.endDate);
		if (filter.teamId) {
			query = query.where((eb) =>
				eb.exists(
					eb
						.selectFrom("game_teams as gt")
						.select("gt.game_id")
						.whereRef("gt.game_id", "=", "games.id")
						.where("gt.team_id", "=", filter.teamId as UUID),
				),
			);
		}
		if (filter.stadiumId) query = query.where("games.stadium_id", "=", filter.stadiumId as UUID);
		if (filter.status) query = query.where("games.status", "=", filter.status as GameStatus);

		// Group by game ID to avoid duplicate rows
		return query.groupBy("games.id");
	}

	private formatResults(results: RawGameQueryResult[]): GameQueryResult[] {
		return results.map((result) => ({
			...result,
			team_names: result.team_names ? result.team_names.split(",") : [],
		}));
	}
}
