import type { Request, Response } from "express";

import type { UUID } from "node:crypto";
import type { GameFilterParams, GameQueryResult, GameService } from "@/api/game";
import type { GameStatus } from "@/models/entities/game";
import type { Stadium } from "@/models/entities/stadium";
import type { Team } from "@/models/entities/team";
import type { ServiceResponse } from "@/models/serviceResponse";

export class GameController {
	private gameService: GameService;

	constructor(gameService: GameService) {
		this.gameService = gameService;
	}

	async getGames(req: Request, res: Response) {
		const filter: GameFilterParams = {
			startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
			endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
			teamId: req.query.teamId as UUID,
			stadiumId: req.query.stadiumId as UUID,
			status: req.query.status as GameStatus,
		};

		const result: ServiceResponse<GameQueryResult[]> = await this.gameService.getGames(filter);
		res.status(result.statusCode).json(result);
	}

	async getTeams(_req: Request, res: Response) {
		const result: ServiceResponse<Team[]> = await this.gameService.getTeams();
		res.status(result.statusCode).json(result);
	}

	async getStadiums(_req: Request, res: Response) {
		const result: ServiceResponse<Stadium[]> = await this.gameService.getStadiums();
		res.status(result.statusCode).json(result);
	}
}
