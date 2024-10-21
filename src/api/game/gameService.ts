import { StatusCodes } from "http-status-codes";
import type Redis from "ioredis";

import type { GameFilterParams, GameQueryResult } from "@/api/game/";
import env from "@/env";
import { logger } from "@/middleware/logger";
import type { DBInstance } from "@/models/database";
import type { Stadium } from "@/models/entities/stadium";
import type { Team } from "@/models/entities/team";
import { ServiceResponse } from "@/models/serviceResponse";
import * as gameRepository from "@/repositories/gameRepository";
import * as stadiumRepository from "@/repositories/stadiumRepository";
import * as teamRepository from "@/repositories/teamRepository";

export class GameService {
	private db: DBInstance;
	private redis: Redis;

	constructor(database: DBInstance, redisClient: Redis) {
		this.db = database;
		this.redis = redisClient;
	}

	async getGames(filter: GameFilterParams): Promise<ServiceResponse<GameQueryResult[]>> {
		const cacheKey = `games:${JSON.stringify(filter)}:${filter.page}:${filter.pageSize}`;
		try {
			const cachedData = await this.redis.get(cacheKey);
			if (cachedData) {
				const games = JSON.parse(cachedData);
				return ServiceResponse.success("Games retrieved successfully", games);
			}

			const games = await gameRepository.queryGames(this.db, filter);
			return ServiceResponse.success("Games retrieved successfully", games);
		} catch (error) {
			logger.error("Error fetching games:", error);
			return ServiceResponse.failure("Failed to fetch games", [], StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async getTeams(): Promise<ServiceResponse<Team[]>> {
		const cacheKey = "teams";
		try {
			const cachedData = await this.redis.get(cacheKey);
			if (cachedData) {
				const teams = JSON.parse(cachedData);
				return ServiceResponse.success("Teams retrieved successfully", teams);
			}

			const teams = await teamRepository.findAll(this.db);

			// If not in cache, fetch from database and cache it
			await this.redis.setex(cacheKey, env.CACHE_TTL, JSON.stringify(teams));

			return ServiceResponse.success("Teams retrieved successfully", teams);
		} catch (error) {
			logger.error("Error fetching teams:", error);
			return ServiceResponse.failure("Failed to fetch teams", [], StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async getStadiums(): Promise<ServiceResponse<Stadium[]>> {
		const cacheKey = "stadiums";
		try {
			const cachedData = await this.redis.get(cacheKey);
			if (cachedData) {
				const stadiums = JSON.parse(cachedData);
				logger.info("Stadiums retrieved from cache");
				return ServiceResponse.success("Stadiums retrieved successfully", stadiums);
			}

			const stadiums = await stadiumRepository.findAll(this.db);
			logger.info("Stadiums retrieved from database");

			// If not in cache, fetch from database and cache it
			await this.redis.setex(cacheKey, env.CACHE_TTL, JSON.stringify(stadiums));

			return ServiceResponse.success("Stadiums retrieved successfully", stadiums);
		} catch (error) {
			logger.error("Error fetching stadiums:", error);
			return ServiceResponse.failure("Failed to fetch stadiums", [], StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}
