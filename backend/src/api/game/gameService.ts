import { StatusCodes } from "http-status-codes";

import type { GameFilterParams, GameQueryResult } from "@/api/game/";
import { logger } from "@/logger";
import type { DBInstance } from "@/models/database";
import type { Stadium } from "@/models/entities/stadium";
import type { Team } from "@/models/entities/team";
import { ServiceResponse } from "@/models/serviceResponse";
import * as gameRepository from "@/repositories/gameRepository";
import * as stadiumRepository from "@/repositories/stadiumRepository";
import * as teamRepository from "@/repositories/teamRepository";

export class GameService {
	private db: DBInstance;

	constructor(database: DBInstance) {
		this.db = database;
	}

	async getGames(filter: GameFilterParams): Promise<ServiceResponse<GameQueryResult[]>> {
		try {
			const games = await gameRepository.queryGames(this.db, filter);
			const formatGames = games.map((game) => ({
				...game,
				team_names: game.team_names ? game.team_names.split(",") : [],
			}));

			return ServiceResponse.success("Games retrieved successfully", formatGames);
		} catch (error) {
			logger.error("Error fetching games:", error);
			return ServiceResponse.failure("Failed to fetch games", [], StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async getTeams(): Promise<ServiceResponse<Team[]>> {
		try {
			const teams = await teamRepository.findAll(this.db);
			return ServiceResponse.success("Teams retrieved successfully", teams);
		} catch (error) {
			logger.error("Error fetching teams:", error);
			return ServiceResponse.failure("Failed to fetch teams", [], StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async getStadiums(): Promise<ServiceResponse<Stadium[]>> {
		try {
			const stadiums = await stadiumRepository.findAll(this.db);
			return ServiceResponse.success("Stadiums retrieved successfully", stadiums);
		} catch (error) {
			logger.error("Error fetching stadiums:", error);
			return ServiceResponse.failure("Failed to fetch stadiums", [], StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}
