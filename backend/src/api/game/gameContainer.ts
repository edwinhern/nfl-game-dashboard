import database from "@/lib/database";
import { GameController } from "./gameController";
import { GameService } from "./gameService";

export class GameContainer {
	private static instance: GameContainer;
	private services: Map<string, unknown> = new Map();

	private constructor() {
		const gameService = new GameService(database);
		const gameController = new GameController(gameService);

		this.services.set("gameService", gameService);
		this.services.set("gameController", gameController);
	}

	static getInstance(): GameContainer {
		if (!GameContainer.instance) {
			GameContainer.instance = new GameContainer();
		}

		return GameContainer.instance;
	}

	get<T>(serviceName: string): T {
		const service = this.services.get(serviceName);
		if (!service) {
			throw new Error(`Service ${serviceName} not found`);
		}

		return service as T;
	}
}

export const gameContainer = GameContainer.getInstance();
