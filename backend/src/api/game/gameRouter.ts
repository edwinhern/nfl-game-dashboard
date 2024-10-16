import { Router } from "express";

import { type GameController, gameContainer } from "@/api/game";

export const createGameRoutes = (): Router => {
	const router = Router();
	const gameController = gameContainer.get<GameController>("gameController");

	router.get("/", gameController.getGames.bind(gameController));
	router.get("/teams", gameController.getTeams.bind(gameController));
	router.get("/stadiums", gameController.getStadiums.bind(gameController));

	return router;
};
