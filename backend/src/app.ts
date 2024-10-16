import express, { type Express } from "express";
import cron from "node-cron";

import { createGameRoutes } from "@/api/game";
import { type SyncController, createSyncRoutes, syncContainer } from "@/api/sync";
import env from "@/env";
import { logger, requestLogger } from "@/logger";

class App {
	private static instance: App | null = null;
	private app: Express;

	private constructor() {
		this.app = express();
		this.setupMiddleware();
		this.setupRoutes();
		this.setupCronJob();
	}

	public static getInstance(): App {
		if (!App.instance) {
			App.instance = new App();
		}
		return App.instance;
	}

	public getApp(): Express {
		return this.app;
	}

	public start(): void {
		this.app.listen(env.PORT, () => {
			logger.info(`Server (${env.NODE_ENV}) running on port http://${env.HOST}:${env.PORT}`);
		});
	}

	private setupMiddleware(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(requestLogger);
	}

	private setupRoutes(): void {
		this.app.use("/api/sync", createSyncRoutes());
		this.app.use("/api/games", createGameRoutes());
	}

	private setupCronJob(): void {
		cron.schedule(env.SYNC_SCHEDULE, async () => {
			const syncController = syncContainer.get<SyncController>("syncController");
			syncController.scheduledSync().catch((error) => {
				logger.error("Error in scheduled sync:", error);
			});
		});
	}
}

export default App.getInstance();
