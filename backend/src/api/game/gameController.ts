import type { Request, Response } from "express";

import type { UUID } from "node:crypto";
import type { GameFilterParams, GameService } from "@/api/game";
import { logger } from "@/logger";
import type { GameStatus } from "@/models/entities/game";
import type { Stadium } from "@/models/entities/stadium";
import type { Team } from "@/models/entities/team";

export class GameController {
	private gameService: GameService;

	constructor(gameService: GameService) {
		this.gameService = gameService;
	}

	async getGames(req: Request, res: Response) {
		try {
			const filter: GameFilterParams = {
				startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
				endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
				teamId: req.query.teamId as UUID,
				stadiumId: req.query.stadiumId as UUID,
				status: req.query.status as GameStatus,
			};

			const games = await this.gameService.getGames(filter);
			res.json(games);
		} catch (error) {
			logger.error("Error in getGames controller:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getTeams(_req: Request, res: Response) {
		try {
			const teams: Team[] = await this.gameService.getTeams();
			res.json(teams);
		} catch (error) {
			logger.error("Error in getTeams controller:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getStadiums(_req: Request, res: Response) {
		try {
			const stadiums: Stadium[] = await this.gameService.getStadiums();
			res.json(stadiums);
		} catch (error) {
			logger.error("Error in getStadiums controller:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
}
